import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // Forces Node to bypass fragile IPv6 routing issues

import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

// Programmatically load .env.local from the project root
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split(/\r?\n/).forEach((line) => {
    if (!line || line.startsWith("#")) return;
    const [key, ...valueParts] = line.split("=");
    if (key) {
      const value = valueParts.join("=").trim();
      process.env[key.trim()] = value.replace(/^['"]|['"]$/g, "");
    }
  });
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ Operation aborted: MONGODB_URI could not be loaded from .env.local.");
  process.exit(1);
}

const initialProducts = [
  {
    name: "Minimalist Kuro Hoodie",
    price: 85.00,
    category: "outerwear",
    tag: "NEW",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600",
    description: "Premium heavyweight organic cotton hoodie featuring a drop-shoulder neo-minimalist silhouette and tonal matte stitching details.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Matte Black", "Graphite Carbon"],
    createdAt: new Date(),
  },
  {
    name: "Cyberpunk Cargo Pants",
    price: 110.00,
    category: "pants",
    tag: "LIMITED",
    imageUrl: "https://images.unsplash.com/photo-1517462964-21fdcec3f25b?q=80&w=600",
    description: "Technical tactical pants engineered with water-repellent nylon weave, modular utility compartments, and adjustable strap arrays.",
    sizes: ["30", "32", "34"],
    colors: ["Obsidian Black", "Sage Green"],
    createdAt: new Date(),
  },
  {
    name: "Studio Oversized Tee",
    price: 45.00,
    category: "shirts",
    tag: "ESSENTIAL",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600",
    description: "260GSM ultra-luxury combed cotton shirt featuring structured dropped shoulders and a boxy architectural profile finish.",
    sizes: ["M", "L", "XL"],
    colors: ["Chalk White", "Vintage Grey"],
    createdAt: new Date(),
  },
  {
    name: "Glassmorphic Utility Vest",
    price: 135.00,
    category: "outerwear",
    tag: "CONCEPT",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600",
    description: "Translucent high-durability grid ripstop shell lining containing integrated inner passport storage pockets and custom zinc alloy hardware.",
    sizes: ["S", "M", "L"],
    colors: ["Frosted Clear", "Stealth Tint"],
    createdAt: new Date(),
  }
];

async function main() {
  const client = new MongoClient(uri!);

  try {
    console.log("⏳ Connecting to remote MongoDB Atlas data cluster...");
    await client.connect();
    
    const db = client.db("tanite_studio");
    const collection = db.collection("products");

    console.log("🧹 Purging existing catalog data to guarantee fresh pipeline indexing... ");
    await collection.deleteMany({});

    console.log(`🌱 Injecting ${initialProducts.length} base product documents into store database...`);
    await collection.insertMany(initialProducts);

    console.log("✅ Seed complete! All item variants registered successfully inside MongoDB.");
  } catch (error) {
    console.error("❌ Transaction pipeline exception occurred during seeding execution:", error);
  } finally {
    await client.close();
    console.log("🔒 Connection pool closed securely.");
  }
}

main();