import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import pg from "pg";
import dotenv from "dotenv";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { PRODUCTS } from "./src/data.js"; // Standard import with extension or relative resolution

// Configure Neon to use WebSockets in Node.js
neonConfig.webSocketConstructor = ws;

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

// Local fallback store if Postgres is not configured or fails to connect
let inMemoryProducts = [...PRODUCTS];

function getDbPool(): any {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    dbError = "DATABASE_URL environment variable is missing. Configure your DATABASE_URL in settings.";
    usePostgres = false;
    return null;
  }

  if (dbPool) return dbPool;

  try {
    const isNeon = connectionString.includes("neon.tech") || connectionString.includes("netlify.app") || connectionString.includes("netlify.db") || connectionString.includes("netlify.com") || connectionString.includes("neondatabase");
    
    if (isNeon) {
      console.log("Detected Serverless Neon/Netlify Database connection string. Using WebSocket database pool.");
      dbPool = new NeonPool({
        connectionString,
        connectionTimeoutMillis: 12000, // 12 seconds to wait for initial WebSocket setup
      });
    } else {
      console.log("Using standard PostgreSQL database pool.");
      dbPool = new pg.Pool({
        connectionString,
        // For serverless databases like Neon (Netlify Database), SSL is required in production
        ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
          ? false
          : { rejectUnauthorized: false },
        connectionTimeoutMillis: 8000, // 8 seconds to wait for initial TCP setup (faster fallback)
        max: 6, // optimal pool size for serverless
        idleTimeoutMillis: 1000, // immediately clear idle connections so we don't hold onto dead sockets
        keepAlive: true, // socket-level keep-alive probes
      });
    }

    dbPool.on("error", (err: any) => {
      console.warn("PostgreSQL idle client error (recovering on next call):", err.message);
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

  try {
    const res = await pool.query(text, params);
    
    // Recovery successful: we successfully ran a query
    usePostgres = true;
    dbError = null;

    // Trigger asynchronous bootstrap if not already done
    if (!dbInitialized && !isBootstrapping && !text.includes("CREATE TABLE") && !text.includes("INSERT INTO")) {
      bootstrapDb();
    }

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
        console.log("Products table is empty. Seeding default products...");
        for (const prod of PRODUCTS) {
          await queryDatabase(`
            INSERT INTO products (
              id, name, "tamilName", price, weight, category, description, image, 
              "colorTheme", ingredients, benefits, "howToUse", "isNew", "isPopular", fssai
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          `, [
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
          ]);
        }
        console.log("Seeding complete. Default products loaded into Netlify Database.");
      }
    }
  } catch (err: any) {
    console.error("Error during table initialization or seeding:", err.message);
    dbError = `Auto-migration/seeding failed: ${err.message}`;
    throw err;
  }
}

async function bootstrapDb() {
  if (dbInitialized || isBootstrapping) return;
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
  } finally {
    isBootstrapping = false;
  }
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

testConnectionOnBoot();

// --- API Endpoints ---

// Get database status
app.get("/api/db-status", async (req, res) => {
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
  const pool = getDbPool();
  if (pool) {
    try {
      await queryDatabase("DELETE FROM products");
      for (const prod of PRODUCTS) {
        await queryDatabase(`
          INSERT INTO products (
            id, name, "tamilName", price, weight, category, description, image, 
            "colorTheme", ingredients, benefits, "howToUse", "isNew", "isPopular", fssai
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        `, [
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
        ]);
      }
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

startServer();
