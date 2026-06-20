import express from "express";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "./src/data.js"; // Standard import with extension or relative resolution

// Prevent serverless functions from crashing due to unhandled promise rejections from db/sockets
process.on("unhandledRejection", (reason, promise) => {
  console.warn("Global alert: Unhandled Promise Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Global alert: Uncaught Exception:", error);
});

// Load environment variables
dotenv.config({ override: true });

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy Database Pool initialization
let dbPool: any = null;
let dbError: string | null = null;
let usePostgres = false;
let dbInitialized = false;
let isBootstrapping = false;
let bootstrapPromise: Promise<void> | null = null;

// Local fallback store if Postgres is not configured or fails to connect
let inMemoryProducts = [...PRODUCTS];

// Supabase Connection Configuration
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || "";
let isSupabaseConfigured = false;
let supabase: any = null;

if (supabaseUrl && supabaseServiceKey) {
  let cleanUrl = supabaseUrl.trim();
  if (cleanUrl.endsWith("/rest/v1/")) {
    cleanUrl = cleanUrl.replace(/\/rest\/v1\/$/, "");
  } else if (cleanUrl.endsWith("/rest/v1")) {
    cleanUrl = cleanUrl.replace(/\/rest\/v1$/, "");
  }
  if (cleanUrl.endsWith("/")) {
    cleanUrl = cleanUrl.slice(0, -1);
  }
  try {
    supabase = createClient(cleanUrl, supabaseServiceKey.trim());
    isSupabaseConfigured = true;
    console.log(`Supabase client successfully configured for project URL: ${cleanUrl}`);
  } catch (err: any) {
    console.error("Failed to initialize Supabase client:", err.message);
  }
}

function getDbPool(): any {
  let connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    dbError = "DATABASE_URL environment variable is missing. Configure your DATABASE_URL in settings.";
    usePostgres = false;
    return null;
  }

  // Handle connection strings wrapped in double-quotes or single-quotes resiliently
  connectionString = connectionString.trim();
  if (connectionString.startsWith('"') && connectionString.endsWith('"')) {
    connectionString = connectionString.slice(1, -1);
  } else if (connectionString.startsWith("'") && connectionString.endsWith("'")) {
    connectionString = connectionString.slice(1, -1);
  }
  connectionString = connectionString.trim();

  if (!connectionString || (!connectionString.startsWith("postgres://") && !connectionString.startsWith("postgresql://"))) {
    dbError = "DATABASE_URL is not a valid PostgreSQL URL (must start with postgres:// or postgresql://). Please re-check Netlify setting.";
    usePostgres = false;
    return null;
  }

  try {
    // Validate that Node's standard URL parser can parse the string cleanly.
    // If there are unencoded special characters in passwords/usernames, this will throw a catchable error.
    new URL(connectionString.replace(/^(postgres|postgresql):\/\//, "https://"));
  } catch (err: any) {
    dbError = `DATABASE_URL is not a valid connection URL format (parsing failed: ${err.message}). If your password contains special characters, please URL-encode them.`;
    usePostgres = false;
    return null;
  }

  if (dbPool) return dbPool;

  try {
    // Log connected DB details safely (excluding password)
    const secureLogUrl = connectionString.replace(/:[^:@]+@/, ":****@");
    console.log(`Initializing database pool for connection: ${secureLogUrl}`);

    const isNetlify = !!process.env.NETLIFY;
    console.log(`Setting up database pool. Environment: ${isNetlify ? "Netlify Serverless" : "Standard Server"}`);

    dbPool = new pg.Pool({
      connectionString,
      // For serverless databases like Neon (Netlify Database) or Cloud SQL, SSL is required in production
      ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
      connectionTimeoutMillis: 6000, // fast connection timeout for serverless handshake
      max: isNetlify ? 3 : 10, // low max pool size for serverless functions to avoid connection exhaustion
      idleTimeoutMillis: isNetlify ? 250 : 30000, // CRITICAL: close idle connections immediately on Netlify so the serverless function can terminate cleanly
      keepAlive: !isNetlify, // CRITICAL: disable socket-level keep-alive on Netlify so the event loop empties instantly
    });

    dbPool.on("error", (err: any) => {
      console.warn("Database pool idle client error (recovering on next call):", err.message);
      dbError = err.message;
      usePostgres = false;
      
      // Cleanly discard pool so next API request recreates fresh sockets
      const oldPool = dbPool;
      dbPool = null;
      if (oldPool) {
        oldPool.end().catch(() => {});
      }
    });

    return dbPool;
  } catch (err: any) {
    console.error("Failed to initialize database pool:", err.message);
    dbError = `Initialization error: ${err.message}`;
    usePostgres = false;
    return null;
  }
}

// Resilient query wrapper to dynamically handle serverless sleep states
async function queryDatabase(text: string, params?: any[]): Promise<any> {
  const pool = getDbPool();
  if (!pool) {
    usePostgres = false;
    return null;
  }

  // Await bootstrap if needed, avoiding infinite recursion during CREATE TABLE / INSERT INTO / SELECT COUNT
  if (!dbInitialized && !text.includes("CREATE TABLE") && !text.includes("INSERT INTO") && !text.includes("SELECT COUNT")) {
    try {
      await bootstrapDb();
    } catch (err: any) {
      console.warn("Awaiting database bootstrap failed:", err.message);
    }
  }

  try {
    const res = await pool.query(text, params);
    
    // Recovery successful: we successfully ran a query
    usePostgres = true;
    dbError = null;

    return res;
  } catch (err: any) {
    console.warn(`Database query execution warning (cleaning pool connections):`, err.message);
    dbError = err.message;
    
    // If it's a connection-level or timeout error, terminate pool immediately and toggle fallback
    if (
      err.message.includes("timeout") ||
      err.message.includes("Connection") ||
      err.message.includes("ECONNREFUSED") ||
      err.message.includes("terminated") ||
      err.message.includes("PG::ConnectionBad") ||
      err.message.includes("failed to connect")
    ) {
      usePostgres = false;
      
      const oldPool = dbPool;
      dbPool = null; // Recreate pool on subsequent client fetch
      if (oldPool) {
        oldPool.end().catch(() => {});
      }
    }
    throw err;
  }
}

// Function to create products table and seed with default PRODUCTS if empty
async function initializeDb() {
  try {
    // 1. Create target table
    await queryDatabase(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(128) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        "tamilName" VARCHAR(255),
        price NUMERIC NOT NULL,
        weight VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        "colorTheme" VARCHAR(50) NOT NULL,
        ingredients JSONB DEFAULT '[]'::jsonb,
        benefits JSONB DEFAULT '[]'::jsonb,
        "howToUse" JSONB DEFAULT '[]'::jsonb,
        "isNew" BOOLEAN DEFAULT FALSE,
        "isPopular" BOOLEAN DEFAULT FALSE,
        fssai VARCHAR(50)
      );
    `);
    console.log("PostgreSQL 'products' table verified/created.");

    // 2. Check if empty
    const checkRes = await queryDatabase("SELECT COUNT(*) FROM products");
    if (checkRes) {
      const count = parseInt(checkRes.rows[0].count, 10);

      if (count === 0) {
        console.log("Products table is empty. Seeding default products with a single bulk query...");
        
        const values: any[] = [];
        const valuePlaceholders: string[] = [];
        
        PRODUCTS.forEach((prod, idx) => {
          const offset = idx * 15;
          valuePlaceholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13}, $${offset + 14}, $${offset + 15})`);
          
          values.push(
            prod.id,
            prod.name,
            prod.tamilName || null,
            prod.price,
            prod.weight,
            prod.category,
            prod.description,
            prod.image,
            prod.colorTheme,
            JSON.stringify(prod.ingredients || []),
            JSON.stringify(prod.benefits || []),
            JSON.stringify(prod.howToUse || []),
            prod.isNew || false,
            prod.isPopular || false,
            prod.fssai || null
          );
        });

        const bulkQuery = `
          INSERT INTO products (
            id, name, "tamilName", price, weight, category, description, image, 
            "colorTheme", ingredients, benefits, "howToUse", "isNew", "isPopular", fssai
          ) VALUES ${valuePlaceholders.join(", ")}
        `;
        
        await queryDatabase(bulkQuery, values);
        console.log("Seeding complete. Default products loaded into Netlify Database.");
      }
    }
  } catch (err: any) {
    console.error("Error during table initialization or seeding:", err.message);
    dbError = `Auto-migration/seeding failed: ${err.message}`;
    throw err;
  }
}

async function bootstrapDb(): Promise<void> {
  if (dbInitialized) return;
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    isBootstrapping = true;
    try {
      await initializeDb();
      dbInitialized = true;
      usePostgres = true;
      dbError = null;
      console.log("Database successfully bootstrapped and verified.");
    } catch (err: any) {
      console.error("Failed to bootstrap database layers:", err.message);
      dbError = `Bootstrap failed: ${err.message}`;
      // Clear promise on failure to allow subsequent retries
      bootstrapPromise = null;
    } finally {
      isBootstrapping = false;
    }
  })();

  return bootstrapPromise;
}

// Resilient background test and startup connection handshake with smart retries & backoffs
async function testConnectionOnBoot() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log("No DATABASE_URL configured yet. Starting up on memory-store fallback.");
    return;
  }

  console.log("Initiating server database connection handshake with retry warming...");
  const maxAttempts = 3;
  let attempt = 0;
  
  while (attempt < maxAttempts) {
    attempt++;
    try {
      const pool = getDbPool();
      if (!pool) return;
      
      console.log(`Database warm-up handshake attempt ${attempt}/${maxAttempts}...`);
      if (attempt > 1) {
        // Incrementing backoff (e.g. 3s, 6s) to allow Neon/Netlify database time to wake up fully
        await new Promise(resolve => setTimeout(resolve, attempt * 3000));
      }
      
      await queryDatabase("SELECT 1");
      console.log("Database connection test handshake verified successfully after cold-start warming!");
      await bootstrapDb();
      return; // Handshake successful!
    } catch (err: any) {
      console.warn(`Database connection handshake attempt ${attempt} failed: ${err.message}`);
      
      // Destroy pool immediately to ensure subsequent attempts build fresh TCP sockets
      const oldPool = dbPool;
      dbPool = null;
      if (oldPool) {
        oldPool.end().catch(() => {});
      }
    }
  }
  
  console.log("Database handshake unsuccessful on server boot-up. App started successfully; will dynamically reconnect when connection is made available.");
}

if (!process.env.NETLIFY) {
  testConnectionOnBoot();
}

// --- API Endpoints ---

// Get database status
app.get("/api/db-status", async (req, res) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("products").select("id").limit(1);
      if (error) {
        return res.json({
          connected: false,
          type: "supabase",
          error: `Supabase integration issue: ${error.message}. Please verify table named 'products' exists in Supabase.`,
          databaseUrlSet: true,
          initialized: false,
        });
      }
      return res.json({
        connected: true,
        type: "supabase",
        error: null,
        databaseUrlSet: true,
        initialized: true,
      });
    } catch (err: any) {
      return res.json({
        connected: false,
        type: "supabase",
        error: `Supabase network/connection issue: ${err.message}`,
        databaseUrlSet: true,
        initialized: false,
      });
    }
  }

  const pool = getDbPool();
  if (pool && !usePostgres) {
    // Attempt dynamic connection recovery via resilient helper
    try {
      await queryDatabase("SELECT 1");
      if (!dbInitialized) {
        bootstrapDb();
      }
    } catch (err: any) {
      // Ignored: already handled & pool recycled inside queryDatabase block
    }
  }

  res.json({
    connected: usePostgres,
    type: usePostgres ? "postgres" : "in-memory-fallback",
    error: dbError,
    databaseUrlSet: !!process.env.DATABASE_URL,
    initialized: dbInitialized,
  });
});

// Fetch all products
app.get("/api/products", async (req, res) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        throw new Error(error.message);
      }
      if (data) {
        const formatted = data.map((row: any) => {
          const tamilName = row.tamilName !== undefined ? row.tamilName : row.tamilname;
          const colorTheme = row.colorTheme !== undefined ? row.colorTheme : row.colortheme;
          const isNewVal = row.isNew !== undefined ? row.isNew : row.isnew;
          const isPopularVal = row.isPopular !== undefined ? row.isPopular : row.ispopular;

          let ingredients = [];
          const rawIngredients = row.ingredients;
          if (Array.isArray(rawIngredients)) {
            ingredients = rawIngredients;
          } else if (typeof rawIngredients === "string") {
            try { ingredients = JSON.parse(rawIngredients); } catch (e) { ingredients = []; }
          }

          let benefits = [];
          const rawBenefits = row.benefits;
          if (Array.isArray(rawBenefits)) {
            benefits = rawBenefits;
          } else if (typeof rawBenefits === "string") {
            try { benefits = JSON.parse(rawBenefits); } catch (e) { benefits = []; }
          }

          let howToUse = [];
          const rawHowToUse = row.howToUse !== undefined ? row.howToUse : row.howtouse;
          if (Array.isArray(rawHowToUse)) {
            howToUse = rawHowToUse;
          } else if (typeof rawHowToUse === "string") {
            try { howToUse = JSON.parse(rawHowToUse); } catch (e) { howToUse = []; }
          }

          return {
            id: row.id,
            name: row.name,
            tamilName: tamilName || null,
            price: parseFloat(row.price),
            weight: row.weight,
            category: row.category,
            description: row.description,
            image: row.image,
            colorTheme: colorTheme || "amber",
            ingredients,
            benefits,
            howToUse,
            isNew: !!isNewVal,
            isPopular: !!isPopularVal,
            fssai: row.fssai
          };
        });

        // Keep order consistent with default catalog
        const defaultOrder = PRODUCTS.map(p => p.id);
        formatted.sort((a, b) => {
          const idxA = defaultOrder.indexOf(a.id);
          const idxB = defaultOrder.indexOf(b.id);
          if (idxA === -1 && idxB === -1) return 0;
          if (idxA === -1) return -1;
          if (idxB === -1) return 1;
          return idxA - idxB;
        });

        return res.json(formatted);
      }
    } catch (err: any) {
      console.warn("Retrying products fetch with memory-store due to Supabase error:", err.message);
    }
  }

  const pool = getDbPool();
  if (pool) {
    try {
      const result = await queryDatabase('SELECT * FROM products');
      
      if (result && result.rows) {
        const formatted = result.rows.map(row => ({
          id: row.id,
          name: row.name,
          tamilName: row.tamilName,
          price: parseFloat(row.price),
          weight: row.weight,
          category: row.category,
          description: row.description,
          image: row.image,
          colorTheme: row.colorTheme,
          ingredients: Array.isArray(row.ingredients) ? row.ingredients : JSON.parse(row.ingredients || '[]'),
          benefits: Array.isArray(row.benefits) ? row.benefits : JSON.parse(row.benefits || '[]'),
          howToUse: Array.isArray(row.howToUse) ? row.howToUse : JSON.parse(row.howToUse || '[]'),
          isNew: !!row.isNew,
          isPopular: !!row.isPopular,
          fssai: row.fssai
        }));

        // Keep order consistent with default catalog
        const defaultOrder = PRODUCTS.map(p => p.id);
        formatted.sort((a, b) => {
          const idxA = defaultOrder.indexOf(a.id);
          const idxB = defaultOrder.indexOf(b.id);
          if (idxA === -1 && idxB === -1) return 0;
          if (idxA === -1) return -1;
          if (idxB === -1) return 1;
          return idxA - idxB;
        });

        return res.json(formatted);
      }
    } catch (err: any) {
      console.warn("Retrying products fetch with memory-store due to db timeout or error:", err.message);
    }
  }

  // Fallback to local memory state
  res.json(inMemoryProducts);
});

// Create product
app.post("/api/products", async (req, res) => {
  const prod = req.body;
  if (!prod.id || !prod.name || !prod.price) {
    return res.status(400).json({ error: "Missing required product fields (id, name, price)" });
  }

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from("products").upsert({
        id: prod.id,
        name: prod.name,
        tamilName: prod.tamilName || null,
        price: prod.price,
        weight: prod.weight || "250g",
        category: prod.category || "General",
        description: prod.description || "",
        image: prod.image || "",
        colorTheme: prod.colorTheme || "amber",
        ingredients: prod.ingredients || [],
        benefits: prod.benefits || [],
        howToUse: prod.howToUse || [],
        isNew: !!prod.isNew,
        isPopular: !!prod.isPopular,
        fssai: prod.fssai || null
      });
      if (error) {
        throw new Error(error.message);
      }
      return res.json({ success: true, product: prod });
    } catch (err: any) {
      console.error("Failed to insert product into Supabase:", err.message);
      return res.status(500).json({ error: `Supabase error: ${err.message}` });
    }
  }

  const pool = getDbPool();
  if (pool) {
    try {
      await queryDatabase(`
        INSERT INTO products (
          id, name, "tamilName", price, weight, category, description, image, 
          "colorTheme", ingredients, benefits, "howToUse", "isNew", "isPopular", fssai
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          "tamilName" = EXCLUDED."tamilName",
          price = EXCLUDED.price,
          weight = EXCLUDED.weight,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          image = EXCLUDED.image,
          "colorTheme" = EXCLUDED."colorTheme",
          ingredients = EXCLUDED.ingredients,
          benefits = EXCLUDED.benefits,
          "howToUse" = EXCLUDED."howToUse",
          "isNew" = EXCLUDED."isNew",
          "isPopular" = EXCLUDED."isPopular",
          fssai = EXCLUDED.fssai
      `, [
        prod.id,
        prod.name,
        prod.tamilName || null,
        prod.price,
        prod.weight || "250g",
        prod.category || "General",
        prod.description || "",
        prod.image || "",
        prod.colorTheme || "amber",
        JSON.stringify(prod.ingredients || []),
        JSON.stringify(prod.benefits || []),
        JSON.stringify(prod.howToUse || []),
        prod.isNew || false,
        prod.isPopular || false,
        prod.fssai || null
      ]);
      return res.json({ success: true, product: prod });
    } catch (err: any) {
      console.error("Failed to insert product into PostgreSQL:", err.message);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  }

  // Fallback update memory state
  const exists = inMemoryProducts.findIndex(p => p.id === prod.id);
  if (exists >= 0) {
    inMemoryProducts[exists] = prod;
  } else {
    inMemoryProducts.push(prod);
  }
  res.json({ success: true, product: prod });
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Failed to delete product from Supabase:", err.message);
      return res.status(500).json({ error: `Supabase error: ${err.message}` });
    }
  }

  const pool = getDbPool();
  if (pool) {
    try {
      await queryDatabase("DELETE FROM products WHERE id = $1", [id]);
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Failed to delete product from PostgreSQL:", err.message);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  }

  // Fallback
  inMemoryProducts = inMemoryProducts.filter(p => p.id !== id);
  res.json({ success: true });
});

// Restore default products
app.post("/api/products/restore", async (req, res) => {
  if (isSupabaseConfigured) {
    try {
      // Delete all products using a filter that matches all (neq id to some dummy)
      const { error: deleteErr } = await supabase.from("products").delete().neq("id", "does_not_exist_dummy_value");
      if (deleteErr) {
        throw new Error(deleteErr.message);
      }
      
      const payload = PRODUCTS.map(prod => ({
        id: prod.id,
        name: prod.name,
        tamilName: prod.tamilName || null,
        price: prod.price,
        weight: prod.weight,
        category: prod.category,
        description: prod.description,
        image: prod.image,
        colorTheme: prod.colorTheme,
        ingredients: prod.ingredients || [],
        benefits: prod.benefits || [],
        howToUse: prod.howToUse || [],
        isNew: !!prod.isNew,
        isPopular: !!prod.isPopular,
        fssai: prod.fssai || null
      }));

      const { error: insertErr } = await supabase.from("products").insert(payload);
      if (insertErr) {
        throw new Error(insertErr.message);
      }
      
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Failed to restore default products in Supabase:", err.message);
      return res.status(500).json({ error: `Supabase error: ${err.message}` });
    }
  }

  const pool = getDbPool();
  if (pool) {
    try {
      await queryDatabase("DELETE FROM products");
      
      const values: any[] = [];
      const valuePlaceholders: string[] = [];
      
      PRODUCTS.forEach((prod, idx) => {
        const offset = idx * 15;
        valuePlaceholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13}, $${offset + 14}, $${offset + 15})`);
        
        values.push(
          prod.id,
          prod.name,
          prod.tamilName || null,
          prod.price,
          prod.weight,
          prod.category,
          prod.description,
          prod.image,
          prod.colorTheme,
          JSON.stringify(prod.ingredients || []),
          JSON.stringify(prod.benefits || []),
          JSON.stringify(prod.howToUse || []),
          prod.isNew || false,
          prod.isPopular || false,
          prod.fssai || null
        );
      });

      const bulkQuery = `
        INSERT INTO products (
          id, name, "tamilName", price, weight, category, description, image, 
          "colorTheme", ingredients, benefits, "howToUse", "isNew", "isPopular", fssai
        ) VALUES ${valuePlaceholders.join(", ")}
      `;

      await queryDatabase(bulkQuery, values);
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Failed to restore default products in PostgreSQL:", err.message);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  }

  // Fallback
  inMemoryProducts = [...PRODUCTS];
  res.json({ success: true });
});

async function startServer() {
  // Vite middleware setup with Express
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on http://localhost:${PORT}`);
  });
}

if (!process.env.NETLIFY) {
  startServer();
}

export default app;
