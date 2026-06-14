import { Product, Recipe } from './types';

export const GIRIJA_CONTACT = "6383992062";
export const GIRIJA_EMAIL = "girijaorganicmillets@gmail.com";
export const GIRIJA_INSTAGRAM = "girijaorganicmillets";

export const PRODUCTS: Product[] = [
  // Health Malts
  {
    id: "ragi-malt",
    name: "Classic Sprouted Ragi Malt",
    tamilName: "கேழ்வரகு மல்து (ராகி மால்ட்)",
    price: 120,
    weight: "250g",
    category: "Health Malts",
    description: "Traditional nutrient-dense wellness beverage mix crafted from carefully washed and sprouted organic finger millets. Slow-roasted to seal in natural vitamins and aroma.",
    image: "/images/ragi_malt_packaging_1781422356325.jpg",
    colorTheme: "amber",
    ingredients: [
      "Sprouted Organic Finger Millet (ராகி / கேழ்வரகு)",
      "Premium Cardamom (ஏலக்காய்) for natural flavor",
      "Roasted Cumin and Almond slivers (சாரப்பருப்பு & பாதாம்)"
    ],
    benefits: [
      "எலும்புகளை வலுப்படுத்தும் கால்சியம் நிறைந்தது (Packed with plant calcium for robust bones)",
      "செரிமானத்தை மேம்படுத்தும் நார்ச்சத்து அதிகம் (High dietary fiber ensures healthy, light digestion)",
      "இரத்த சோகையை தடுத்து இரும்புச்சத்தை ஈடுகட்டும் (Excellent iron booster to assist hemoglobin levels)",
      "நோய் எதிர்ப்பு சக்தி மற்றும் தசை வளர்ச்சியைத் தரும் (Boosts pediatric and adult immunity factors)",
      "உடலுக்கு நாள் முழுவதும் நீடித்த இயற்கை ஆற்றல் வழங்கும் (Slow-release carbs generate sustained vitality)"
    ],
    howToUse: [
      "Take 2 to 3 rounded tablespoons of Girija Sprouted Ragi Malt.",
      "Mix thoroughly in 200ml of room-temperature milk or water to avoid lumps.",
      "Boil the mixture on low-to-medium heat for 3-4 minutes while stirring continuously.",
      "Sweeten with organic palm sugar, honey, or raw jaggery. Serve warm!"
    ],
    isPopular: true,
    fssai: "224265320000192"
  },
  {
    id: "abc-malt",
    name: "Premium ABC Health Drink Mix",
    tamilName: "ஏபிசி மால்ட் (ஆப்பிள், பீட்ரூட், கேரட்)",
    price: 180,
    weight: "250g",
    category: "Health Malts",
    description: "A superfood blend of sweet Apple, earthy Beetroot, and vitamin-rich Carrot. Enhanced with sprouted almonds and traditional spices for peak system detoxification and natural facial glow.",
    image: "/images/abc_malt_packaging_1781422431988.jpg",
    colorTheme: "rose",
    ingredients: [
      "Dehydrated Fresh Red Apples (ஆப்பிள்)",
      "Pure Iron-rich Beetroot Extract (பீட்ரூட்)",
      "Sprouted Carrots rich in Vitamin A (கேரட்)",
      "Sprouted Almond Powder (பாதாம் பருப்பு)",
      "Organic Cardamom (ஏலக்காய்)"
    ],
    benefits: [
      "Apple: High in antioxidants and vitamins that improve cell elasticity",
      "Beetroot: Improves red blood cell count and supports hepatic detoxification",
      "Carrot: Strengthens eyesight, skin cell health, and basic mucosal immunity",
      "Zero added sugars, artificial preservatives, or chemical coloring elements",
      "Improves active stamina and promotes natural brightness in skin complexion"
    ],
    howToUse: [
      "Add 2 tablespoons of ABC Malt to a cup.",
      "Pour 150ml of piping hot or chilled organic milk or lukewarm drinking water.",
      "Stir briskly for 30 seconds until completely dissolved. Drink fresh before breakfast for optimal absorption."
    ],
    isNew: true,
    fssai: "224265320000192"
  },

  // Millet Flakes (அவல்)
  {
    id: "organic-poha",
    name: "Organic Poha",
    tamilName: "இயற்கை தினை அவல் (Organic Millet Poha)",
    price: 110,
    weight: "250g",
    category: "Millet Flakes",
    description: "Highly nutritious whole grain flakes made from carefully sourced organic millets. Lightly steamed and flattened to retain natural fiber, proteins, and essential minerals.",
    image: "/images/organic_poha_packaging_1781422412522.jpg",
    colorTheme: "yellow",
    ingredients: ["100% Organic Flaked Millets (தினை அவல்) - zero chemical processing."],
    benefits: [
      "Extremely light on stomach, perfect for quick breakfast and evening meals",
      "Low glycemic response, ideal choice for diabetes management",
      "Sustained complex carbohydrate release provides energy throughout the day"
    ],
    howToUse: [
      "Rinse the flakes briefly in cold water and drain immediately.",
      "Let them rest in a covered bowl for 5 minutes to become soft and fluffy.",
      "Prepare as delicious savory yellow Poha with mild mustard, green chillies, and peanuts."
    ],
    isPopular: true
  },
  {
    id: "poongar-flakes",
    name: "Traditional Poongar Rice Flakes",
    tamilName: "பூங்கார் அரிசி அவல் (Women's Special)",
    price: 95,
    weight: "250g",
    category: "Millet Flakes",
    description: "An ancient heirloom red grain exceptionally rich in trace minerals. Highly treasured as women's health food because it aids in balancing hormones and rebuilding postpartum strength.",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600", // Pinkish raw grains/granola
    colorTheme: "red",
    ingredients: ["100% Single-Origin Poongar Red Rice (பூங்கார் பாரம்பரிய அரிசி)"],
    benefits: [
      "Strong hormonal balancing trace elements for women of all cycles",
      "Supercharged with biological iron and zinc to prevent fatigue and anemia",
      "Highly digestible and light on the stomach, ideal for nursing mothers"
    ],
    howToUse: [
      "Rinse lightly and let it damp-stew for 3 minutes.",
      "Mix with organic jaggery, fresh-grated cardamoms, and shredded coconut for an authentic, delicious Tamil evening snack."
    ]
  },
  {
    id: "little-flakes",
    name: "Organic Little Millet Flakes",
    tamilName: "சாமை அவல் (Little Flakes)",
    price: 80,
    weight: "250g",
    category: "Millet Flakes",
    description: "Finely processed flakes made from certified organic Little Millets. High in magnesium and fat-soluble vitamins, perfect for low-calorie weight loss goals.",
    image: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=600", // Golden grain flakes
    colorTheme: "emerald",
    ingredients: ["Organic Little Millet (சாமை அரிசி)"],
    benefits: [
      "Rich in complex dietary fibers that help reduce cholesterol levels",
      "Fosters stable bowel activity and supports systemic metabolic speed",
      "Ideal replacement for heavy white rice poha"
    ],
    howToUse: [
      "Moisten with water or thin buttermilk, leave aside for 2-3 minutes.",
      "Prepare like traditional poha with turmeric, groundnuts, and fresh coriander."
    ]
  },
  {
    id: "karunguruvai-flakes",
    name: "Heirloom Karunguruvai Flakes",
    tamilName: "கருங்குறுவை அரிசி அவல் (Immunity Special)",
    price: 110,
    weight: "250g",
    category: "Millet Flakes",
    description: "Rare traditional dark red flakes made from ancient Karunguruvai paddy. Celebrated in Siddha and local folklore for medicinal and heavy immunity-restoring properties.",
    image: "/images/karunguruvai_flakes_1781431075326.jpg",
    colorTheme: "brown",
    ingredients: ["100% Ancient Karunguruvai Rice (கருங்குறுவைTraditional Paddy)"],
    benefits: [
      "Contains dense anthocyanins (powerful natural dark-red antioxidants)",
      "Tears down toxins and stimulates cellular replenishment",
      "Supports joint health, chronic bone ease, and kidney function support"
    ],
    howToUse: [
      "Soak for 5 minutes, squeeze excess moisture.",
      "Blend into healthy breakfast bowls, swallow with raw milk, or turn into red curd-flat-rice."
    ]
  },
  {
    id: "mapillai-samba-flakes",
    name: "Mappillai Samba Stamina Flakes",
    tamilName: "மாப்பிள்ளை சம்பா அவல் (Bridegroom Rice)",
    price: 95,
    weight: "250g",
    category: "Millet Flakes",
    description: "Rolled from traditional Tamil 'Mappillai Samba' red rice. Cultivated historically to give intense muscle strength, endurance, and nerve health to athletes and physically active youth.",
    image: "/images/mappillai_stamina_flakes_1781431060505.jpg",
    colorTheme: "red",
    ingredients: ["100% Traditional Mappillai Samba Red Rice (மாப்பிள்ளை சம்பா அரிசி)"],
    benefits: [
      "Increases core physical stamina, muscular density, and endurance",
      "Provides rich magnesium, iron, and slow, complex starches",
      "Combats nerve exhaustion and chronic muscle cramps"
    ],
    howToUse: [
      "Drizzle with water and let hydrate for 4 minutes.",
      "Cook with ghee, onions, mustard seeds, and cashews for a royal nutritious morning breakfast."
    ]
  },

  // Millet Noodles
  {
    id: "jowar-noodles",
    name: "Jowar Millet Instant Noodles - 175gm",
    tamilName: "சோளம் இன்ஸ்டன்ட் நூடுல்ஸ் (Jowar Noodles)",
    price: 160,
    weight: "175g",
    category: "Millet Noodles",
    description: "High-end, completely non-fried instant noodles crafted from air-dried Sorghum (Jowar) grains and whole wheat. Clean formulated without MSG, trans-fats, or artificial binders.",
    image: "/images/jowar_noodles_packaging_1781422377655.jpg",
    colorTheme: "orange",
    ingredients: ["Sorghum Flour (Jowar / சோளம்)", "Whole Wheat flour for binding", "Natural Rock Salt", "Herbal Seasoning Pack (Coriander, Cumin, Pepper, Ginger, Cardamom)"],
    benefits: [
      "100% Non-fried and dehydrated without toxic palm oil or high heat sweeps",
      "No added MSG (Mono Sodium Glutamate), chemical colors, or synthetic fillers",
      "Gluten-balanced, clean, easy to digest, keeping children active and well-nourished"
    ],
    howToUse: [
      "Boil 800ml of water with 1 tsp of cooking oil.",
      "Add Jowar Millet Instant Noodles and boil for 4-5 minutes until tender.",
      "Stir-fry your choice of vegetables in a wok, stir in the cooked noodles along with the spice seasoning pack, and serve hot!"
    ],
    isNew: true
  },
  {
    id: "little-millet-hakka-noodles",
    name: "Little Millet Hakka Noodles 180gm",
    tamilName: "சாமை ஹக்கா நூடுல்ஸ் (Little Millet Hakka)",
    price: 170,
    weight: "180g",
    category: "Millet Noodles",
    description: "Delicious and nutrient-dense Hakka noodles crafted from premium organic Little Millet grains. Offers wonderful bite and pairs beautifully with fresh peppers and spices.",
    image: "/images/hakka_noodles_packaging_1781422395705.jpg",
    colorTheme: "pink",
    ingredients: ["Organic Little Millet Flour (சாமை)", "Whole Wheat", "Rock Salt", "Natural Chinese spice sachet"],
    benefits: [
      "Non-fried formulation ensures extremely light digestion and zero heavy oil feel",
      "Excellent dietary fiber to cleanse the digestive tract and assist system movement",
      "Perfect lunchbox or family meal replacement for processed maida noodles"
    ],
    howToUse: [
      "Boil in fresh water until soft (around 4 minutes).",
      "Drain and rinse under cold water to keep strands beautifully separate.",
      "Stir-fry with spring onions, julienned carrots, celery, and the spice sachet."
    ]
  },
  {
    id: "little-millet-sevai",
    name: "Little Millet Sevai - 175gm",
    tamilName: "சாமை சேமியா (Little Millet Vermicelli)",
    price: 150,
    weight: "175g",
    category: "Millet Noodles",
    description: "Traditional thin vermicelli prepared from certified organic Little Millet. Soft, nutritious, and incredibly fast to steam-cook.",
    image: "/images/sevai_packaging_1781422467266.jpg",
    colorTheme: "red",
    ingredients: ["100% Organic Little Millet (சாமை)", "Salt", "Wheat extract"],
    benefits: [
      "Naturally gluten-low, extremely satisfying and light",
      "Ideal clean energy source for diabetic individuals and health enthusiasts",
      "Highly adaptable for dynamic sweet or savory recipe ideas"
    ],
    howToUse: [
      "Steam the vermicelli or soak in boiling water for 3 minutes, then drain.",
      "Temper with mustard seeds, chillies, curry leaves, and lemon juice for a classic, quick Lemon Sevai."
    ]
  },
  {
    id: "palak-noodles",
    name: "Iron-Rich Palak Millet Noodles",
    tamilName: "பாலக்கீரை நூடுல்ஸ் (Palak Spinach Noodles)",
    price: 85,
    weight: "250g",
    category: "Millet Noodles",
    description: "Beautiful jade-green noodles enriched with fresh farm-plucked spinach (Palak). Packed with dietary iron, folate, and calcium for a healthy lifestyle.",
    image: "/images/palak_noodles_packaging_1781422520320.jpg",
    colorTheme: "emerald",
    ingredients: ["Blend of Barnyard & Foxtail Millets", "Fresh Pureed Palak Spinach", "Whole wheat", "Rock salt", "Spice seasoning envelope"],
    benefits: [
      "Loaded with magnesium, folate, and vitamins directly from organic spinach",
      "Contains no synthetic green food colors or MSG",
      "Highly recommended for active children, pregnant women, and fitness enthusiasts"
    ],
    howToUse: [
      "Boil, drain, and cool.",
      "Toss with olive oil, crushed garlic, sesame seeds, and light roasted veggies."
    ]
  },

  // Millet Rava
  {
    id: "mapillai-samba-rava",
    name: "Mappillai Samba Red Rice Rava",
    tamilName: "மாப்பிள்ளை சம்பா அரிசி ரவை",
    price: 120,
    weight: "500g",
    category: "Millet Rava",
    description: "Slightly coarse, high-fiber rava cracked from parboiled traditional Bridegroom Red Rice. Ideal substitute for normal white wheat semolina.",
    image: "/images/mappillai_samba_rava_1781431043965.jpg",
    colorTheme: "red",
    ingredients: ["100% Traditional Mappillai Samba Red grains - coarse ground (ரவை)"],
    benefits: [
      "Nourishes the peripheral nervous system and helps heal painful mouth ulcers",
      "Excellent source of iron, zinc, and muscle-repairing potassium",
      "Extremely satisfying meal that prevents mid-day hunger pangs"
    ],
    howToUse: [
      "Use as a 1:3 ratio with boiling water.",
      "Sauté vegetables, roast the rava gently in a spoonful of ghee, then slow cook in spiced boiling water to make premium diabetic-friendly Mappillai Samba Upma."
    ]
  },
  {
    id: "barnyard-rava",
    name: "Organic Barnyard Millet Rava",
    tamilName: "குதிரைவாலி ரவை (Barnyard Rava)",
    price: 160,
    weight: "500g",
    category: "Millet Rava",
    description: "Coarse organic Barnyard Millet groats processed under strict hygienic conditions. Ideal for preparing healthy, diabetic-safe upma, khichdi, and sweet kesari.",
    image: "/images/barnyard_millet_rava_1781431023140.jpg",
    colorTheme: "indigo",
    ingredients: ["Pure Certified Organic Barnyard Millet (குதிரைவாலி) grain groats"],
    benefits: [
      "Natural premium source of easily digestible plant protein and dietary fibers",
      "Extremely low glycemic response, assisting in lipid profile control",
      "Gluten-free grains which work beautifully for sensitive digestion and gut healing"
    ],
    howToUse: [
      "Slow-toast the rava until fragrant.",
      "Cook with chopped vegetables, green chillies, ginger, and hot water for a hearty, healthy morning breakfast."
    ]
  },

  // Instant Mixes & Flour
  {
    id: "pacha-paruppu-dosai",
    name: "Sprouted Pacha Paruppu Dosa Mix",
    tamilName: "பச்சை பருப்பு தோசை இன்ஸ்டன்ட் மிக்ஸ்",
    price: 125,
    weight: "250g",
    category: "Instant Mixes & Flour",
    description: "Instant healthy dosa flour mix loaded with carefully sprouted Green Gram (Mung bean) and balanced whole millets. Yields delicious, crispy, rich dosas in less than 5 minutes.",
    image: "/images/pacha_paruppu_packaging_1781422502982.jpg",
    colorTheme: "emerald",
    ingredients: ["Sprouted Green Gram flour (பச்சைப்பயறு)", "Sorghum & Pearl Millet flour", "Rice flour for crispness", "Rock salt", "Curry leaves", "Cumin seeds"],
    benefits: [
      "Very high organic protein value, supporting daily calorie goals",
      "Instant preparation – no overnight grinding, soaking, or fermentation required",
      "Rich in folate, plant lipids, and complex blood-purifying fiber"
    ],
    howToUse: [
      "Mix 1 cup of Dosa Mix with approximately 1.2 cups of fresh water and 1 tablespoon of fresh sour curd (optional) to make a smooth dosa batter.",
      "Let the batter rest for 10-15 minutes.",
      "Pour onto a hot griddle, spread into thin circular crepes, drizzle with cold-pressed gingelly oil, and cook until golden brown."
    ]
  },
  {
    id: "kambu-dosai",
    name: "Kambu (Pearl Millet) Dosa Mix",
    tamilName: "கம்பு தோசை இன்ஸ்டன்ட் மிக்ஸ் (Pearl Millet)",
    price: 130,
    weight: "250g",
    category: "Instant Mixes & Flour",
    description: "Instant millet batter mix containing iron-dense pearl millets (Kambu/Bajra). Extremely cooling for the digestive system and highly recommended for modern weight-management programs.",
    image: "/images/kambu_dosai_packaging_1781422485926.jpg",
    colorTheme: "yellow",
    ingredients: ["Organic Pearl Millet flour (கம்பு)", "Urad Dal flour", "Red Rice powder", "Fenugreek seeds (வெந்தயம்)", "Rock salt"],
    benefits: [
      "Rich in magnesium and protein, which helps stabilize blood pressure",
      "Highly cooling food ideal for warm tropical and summer climates",
      "High iron content helps maintain energy levels all day long"
    ],
    howToUse: [
      "Blend with water for an even batter. Add grated onions, green chillies, and ginger for extra flavor.",
      "Spread thin onto a medium-hot cast-iron tawa and roast with ghee or sesame oil."
    ],
    isPopular: true
  },
  {
    id: "idly-podi",
    name: "Traditional Homemade Idly Podi",
    tamilName: "சுவையான வீட்டு இட்லி பொடி (Idly Podi)",
    price: 140,
    weight: "250g",
    category: "Instant Mixes & Flour",
    description: "Highly aromatic, premium homemade spice powder (Idly Milagai Podi). Small-batch roasted using dry organic red chillies, white sesame, whole black lentils, and standard compound asafoetida.",
    image: "/images/idly_podi_packaging_1781422450554.jpg",
    colorTheme: "red",
    ingredients: ["Whole Black Lentil (உளுந்து)", "Bengal Gram (கடலைப் பருப்பு)", "Organic Dry Red Chillies (வரமிளகாய்)", "White Sesame Seeds (எள்)", "Rock Salt", "Pure Hing (பெருங்காயம்)", "Fresh Curry leaves"],
    benefits: [
      "100% Homemade taste with authentic aroma without synthetic coloring",
      "Zero oil used in roasting, no food-starch fillers or chemical preservatives",
      "Rich in natural iron, lecithin, and essential lipids from wholesome lentils"
    ],
    howToUse: [
      "Mix 2 teaspoons of Idli Podi with a teaspoon of pure wood-pressed sesame (gingelly) oil or melted golden ghee.",
      "Use as a dip for steaming hot idlis, soft dosas, or toss with hot rice as a delicious podi sadham."
    ],
    isPopular: true,
    fssai: "224265320000192"
  },

  // Combo Offers
  {
    id: "millet-combo-349",
    name: "Classic Organic Millet Combo Offer",
    tamilName: "ஹெல்தி காம்போ பேக் (Value Combo)",
    price: 349,
    weight: "1 Combo Box",
    category: "Combo Offers",
    description: "An ultimate family pack curated to bring optimal health into your kitchen at an unbeatable introductory rate. Includes premium instant mixes, flours, and delicious noodles.",
    image: "/images/millet_combo_packaging_1781422537199.jpg",
    colorTheme: "teal",
    ingredients: [
      "1 x Sprouted Pacha Paruppu Dosa Mix (250g)",
      "1 x Kambu Pearl Millet Dosa Mix (250g)",
      "1 x Siru Thaniyangal Chapathi Flour (500g)",
      "1 x Vibrant Beetroot or Carrot Millet Noodles (250g)"
    ],
    benefits: [
      "Super Value Bundle - SAVE over 25% compared to purchasing individually!",
      "Perfect introduction to trying out diverse, highly nutritious millet meals",
      "Chemical-free packaging ensuring no contamination and long freshness"
    ],
    howToUse: [
      "Refer to individual packages for specific preparation methods.",
      "Keep stored in a cool, airtight container away from direct sunlight once opened."
    ],
    isPopular: true
  }
];

export const RECIPES: Recipe[] = [
  {
    id: "ragi-malt-energy",
    title: "Sprouted Ragi Malt Booster",
    subtitle: "ராகி மால்ட் ஹெல்த் டிரிங்க்",
    description: "A fast, hyper-healthy beverage perfect for growing children and busy professionals. Naturally rich in calcium and highly satisfying.",
    image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=600",
    prepTime: "5 mins",
    difficulty: "Easy",
    servings: "2 Servings",
    relatedProductId: "ragi-malt",
    ingredients: [
      { name: "Girija Sprouted Ragi Malt", amount: "3 tbsp", productId: "ragi-malt" },
      { name: "Organic milk or Almond milk", amount: "300ml" },
      { name: "Water", amount: "100ml" },
      { name: "Organic Palm Jaggery / brown sugar", amount: "2 tbsp" },
      { name: "Crushed Almonds", amount: "1 tsp (for garnish)" }
    ],
    steps: [
      "Take 3 tbsp of Sprouted Ragi Malt and dissolve in 100ml water completely at room temperature, making sure no dry pockets or lumps remain.",
      "Bring the milk to a boil in a thick-bottomed container on medium heat.",
      "Slowly pour the dissolved ragi mix into the boiling milk while keeping your flame low.",
      "Stir continuously with a ladle for 3 minutes to avoid stickiness at the base as it thickens.",
      "Add palm jaggery, stir until fully dissolved, and switch off the stove.",
      "Garnish with chopped almonds and serve warm."
    ],
    tags: ["Beverage", "Calcium Rich", "Kids Special", "Quick"]
  },
  {
    id: "beetroot-millet-chowmein",
    title: "Stir-Fried Beetroot Millet Noodles",
    subtitle: "ருசியான பீட்ரூட் நூடுல்ஸ் பிரட்டல்",
    description: "An elegant, highly nutrient-dense recipe swapping chemical-ridden instant raves with naturally colorful beetroot millet noodles.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=600",
    prepTime: "15 mins",
    difficulty: "Medium",
    servings: "2-3 Servings",
    relatedProductId: "beetroot-noodles",
    ingredients: [
      { name: "Girija Beetroot Millet Noodles", amount: "1 Pack (250g)", productId: "beetroot-noodles" },
      { name: "Finely sliced carrots & beans", amount: "1/2 cup" },
      { name: "Cubed bell peppers", amount: "1/4 cup" },
      { name: "Cold-pressed coconut oil", amount: "1.5 tbsp" },
      { name: "Girija herbal tastemaker packet", amount: "1 envelope", productId: "beetroot-noodles" },
      { name: "Fresh spring onions & pepper", amount: "A handful" }
    ],
    steps: [
      "Boil 1.2 liters of water in a pan. Add a pinch of salt and a tsp of coconut oil.",
      "Add Girija Beetroot Millet Noodles. Cook for 4 minutes. Test with a fork to ensure it is cooked 'al dente'.",
      "Immediately drain into a colander, and run cold water over the hot noodles to prevent sticky starch coagulation. Keep aside.",
      "Heat oil in a flat wok. Sauté ginger, garlic, chopped carrots, beans, and bell peppers on high flame for 2 minutes to keep them crunchy.",
      "Add the cooked beetroot noodles along with the spice seasoning tastemaker.",
      "Toss with extreme care for 1-2 minutes using two forks so the stringy noodles do not break.",
      "Garnish with juicy fresh scallions and serve hot with garlic sauce!"
    ],
    tags: ["Healthy Dinner", "Kids Lunchbox", "Antioxidant Rich", "Vegan Friendly"]
  },
  {
    id: "village-idly-podi-bite",
    title: "Ghee Podi Idly Skewers",
    subtitle: "நெய் இட்லி பொடி மினி பைட்ஸ்",
    description: "Transform plain left-over idlis into highly addictive, spice-coated golden nuggets utilizing Girija's aromatic homemade Idly Podi.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600",
    prepTime: "10 mins",
    difficulty: "Easy",
    servings: "3 Servings",
    relatedProductId: "idly-podi",
    ingredients: [
      { name: "Fresh or leftover Mini Idlis", amount: "15-20 units" },
      { name: "Girija Traditional Homemade Idly Podi", amount: "3 tbsp", productId: "idly-podi" },
      { name: "Pure Cow Ghee or Sesame oil", amount: "2 tbsp" },
      { name: "Mustard seeds and Curry Leaves", amount: "1 tsp" },
      { name: "Cashews", amount: "5-6 units (halved)" }
    ],
    steps: [
      "If using standard large idlis, cut them into neat, even bite-sized quarters.",
      "Heat cow ghee in a deep non-stick frying pan, add mustard seeds and let them sputter.",
      "Add fresh curry leaves and halved cashews, sautéing until sweet and golden.",
      "Toss in the mini idli bites and fry on medium heat for 2 minutes until the skin turns slightly crisp and golden-hued.",
      "Sprinkle the Girija Traditional Idly Podi generously over the hot idlis.",
      "Shake and flip the pan repeatedly so the golden podi sticks evenly to every crevice of the idlis in a dense coat.",
      "Turn off the heat. Serve with freshly brewed ginger chai."
    ],
    tags: ["Snack Pack", "Spicy Delight", "Traditional Goodness", "Quick Cook"]
  },
  {
    id: "kambu-instant-dosa",
    title: "Crispy Pearl Millet Crepes",
    subtitle: "மொறுமொறுப்பான கம்பு தோசை",
    description: "Ditch the tedious grinding cycle and cook ultra-thin, cooling bajra crepes immediately for an energizing diabetic-friendly breakfast.",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=600",
    prepTime: "15 mins",
    difficulty: "Easy",
    servings: "4 Servings",
    relatedProductId: "kambu-dosai",
    ingredients: [
      { name: "Girija Kambu Dosa Instant Mix", amount: "1.5 cups", productId: "kambu-dosai" },
      { name: "Water", amount: "Approx 2 cups" },
      { name: "Finely minced shallots (Cinna Vengayam)", amount: "1/4 cup" },
      { name: "Finely chopped fresh coriander & green chilli", amount: "2 tbsp" },
      { name: "Gingelly oil (நல்லெண்ணெய்)", amount: "3 tbsp" }
    ],
    steps: [
      "In a deep mixing bowl, blend the Girija Kambu Dosa Mix with water until a light, flowing consistency similar to Rava Dosa batter is achieved.",
      "Stir in the chopped onions, coriander, green chillies, and cumin seeds.",
      "Heat a cast-iron tawa until hot. Test by splashing water – it should sizzle immediately.",
      "Stir the batter from the bottom of the bowl and pour a ladle full from the outer edges of the tawa moving toward the center (do not spread it like a heavy dosa; pour it dynamically).",
      "Drizzle 1 tsp of pure gingelly oil around the edges and cook on high heat for 2 minutes until it starts turning dark golden brown and edges lift naturally.",
      "Flip carefully and cook the secondary side for 1 minute.",
      "Serve hot with spicy garlic chutney or sweet tomato relish."
    ],
    tags: ["High Fiber", "Breakfast", "Instant Cook", "Gluten Free"]
  }
];

export const MILLETS_INFO = [
  {
    englishName: "Finger Millet / Ragi",
    tamilName: "கேழ்வரகு / ராகி",
    benefits: "Highest plant-based calcium source (344mg/100g). Essential for bone density, nerve transmission, and pediatric teeth development. Provides low glycemic index release.",
    nutritionPer100g: "Calcium: 344mg, Protein: 7.3g, Iron: 3.9mg, Dietary Fiber: 11.5g"
  },
  {
    englishName: "Pearl Millet / Kambu",
    tamilName: "கம்பு (Bajra)",
    benefits: "Extremely cooling food. Rich in iron, zinc, and high-quality proteins. Improves hemoglobin levels and regulates tissue-growth hormones.",
    nutritionPer100g: "Iron: 8.0mg, Protein: 11.6g, Magnesium: 137mg, Fiber: 8.5g"
  },
  {
    englishName: "Foxtail Millet / Thinai",
    tamilName: "தினை அரிசி",
    benefits: "Loaded with neurological thiamine and healthy complex carbs. Helps lower bad blood cholesterol (LDL) and supports cardiac muscles.",
    nutritionPer100g: "Protein: 12.3g, Thiamine: 0.6mg, Fiber: 8.0g, Carbohydrates: 60.9g"
  },
  {
    englishName: "Barnyard Millet / Kuthiraivali",
    tamilName: "குதிரைவாலி",
    benefits: "Easiest millet to digest. Exceptional levels of dietary fiber and starch molecules which feed healthy probiotic bowel bacteria.",
    nutritionPer100g: "Fiber: 13.6g, Protein: 6.2g, Phosphorous: 280mg, Iron: 5.0mg"
  },
  {
    englishName: "Little Millet / Saamai",
    tamilName: "சாமை அரிசி",
    benefits: "Rich in plant lignans and magnesium. Ideal for cellular health, detoxification channels, and preventing type-2 diabetes.",
    nutritionPer100g: "Protein: 7.7g, Magnesium: 91mg, Iron: 9.3mg, Fiber: 7.6g"
  }
];

export const FAQs = [
  {
    question: "Do Girija Millets contain any added preservatives or color ingredients?",
    answer: "No. Girija Millets is established on purity. All our items, including sprouted malts, instant mixes, noodles, and podis, are prepared without synthetic colorants (like Tartrazine or Carmoisine), MSG, enhancers, or chemical stabilizers. We only package freshly processed, raw local items."
  },
  {
    question: "How do I place an order? Is there a minimum purchase limit?",
    answer: "We make ordering seamless! Add your preferred items to the digital shopping cart on this website. When you are ready, click 'Send Order via WhatsApp'. This instantly packages your shopping list and total pricing into a clean, pre-filled WhatsApp message. Open it, tap send, and we will confirm payment (GPay/PhonePe) and shipping details directly. There is no minimum purchase limit!"
  },
  {
    question: "What is special about Sprouted Ragi Malt compared to normal Ragi Flour?",
    answer: "Sprouting involves soaking finger millets till small roots emerge. This process breaks down complex starches, increases bio-available iron and calcium levels by up to 300%, and digests easily. Normal ragi flour can be heavy on the infant stomach; our sprouted malt is exceptionally light, nutty, and delicious."
  },
  {
    question: "How do you maintain hygiene and quality in your formulation room?",
    answer: "Our central formulation facility is fully sanitized. This ensures strict adherence to hot-air sterilization, dry packaging, deep raw-ingredient sorting, and non-chemical processing guidelines to deliver the absolute highest possible quality grain."
  },
  {
    question: "Do you ship across India? How long does delivery take?",
    answer: "Yes, we ship pan-India utilizing dynamic postal registers and professional courier channels. Deliveries within Tamil Nadu take 1-3 business days. Outstation deliveries take 3-5 business days. Once you message us on WhatsApp with your cart, we share instant parcel tracking links."
  }
];
