import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./authHelpers";

const initialProducts = [
  {
    name: "Studio Oversized Hoodie",
    price: 96,
    stock: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
    category: "Hoodies",
    description:
      "A relaxed heavyweight hoodie with a clean architectural silhouette and premium cotton shell.",
    tag: "NEW",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Stone"],
  },
  {
    name: "Minimal Tailored Coat",
    price: 148,
    stock: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000&auto=format&fit=crop",
    category: "Outerwear",
    description:
      "A structured outer layer designed for sharp lines, long drape, and everyday versatility.",
    tag: "LIMITED",
    sizes: ["S", "M", "L"],
    colors: ["Camel", "Charcoal"],
  },
  {
    name: "Utility Denim Jacket",
    price: 112,
    stock: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    category: "Jackets",
    description:
      "A lightly washed denim jacket with utility pockets and a refined, modern fit.",
    tag: "ESSENTIAL",
    sizes: ["M", "L", "XL"],
    colors: ["Indigo", "Stone"],
  },
  {
    name: "Contour Knit Tee",
    price: 54,
    stock: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop",
    category: "Tees",
    description:
      "A premium knit tee with a sculpted shape and elegant drape for minimal daily wear.",
    tag: "BESTSELLER",
    sizes: ["S", "M", "L"],
    colors: ["Cream", "Black"],
  },
  {
    name: "Sculpted Wool Blazer",
    price: 176,
    stock: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
    category: "Blazers",
    description:
      "Sharp tailoring with soft structure and a modern masculine silhouette for elevated dressing.",
    tag: "EDITOR'S PICK",
    sizes: ["S", "M", "L"],
    colors: ["Midnight", "Grey"],
  },
  {
    name: "Soft Tech Jogger",
    price: 88,
    stock: 16,
    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
    category: "Pants",
    description:
      "A streamlined jogger made for movement, comfort, and a polished city-ready look.",
    tag: "TRENDING",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Graphite", "Olive"],
  },
  {
    name: "Cropped Shell Jacket",
    price: 124,
    stock: 11,
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
    category: "Outerwear",
    description:
      "A weather-ready shell jacket that pairs refined utility details with a sleek cropped fit.",
    tag: "NEW",
    sizes: ["S", "M", "L"],
    colors: ["Sand", "Black"],
  },
  {
    name: "Minimalist Knit Set",
    price: 132,
    stock: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=1000&auto=format&fit=crop",
    category: "Sets",
    description:
      "An elevated matching set with relaxed proportions and a soft, textural finish.",
    tag: "COLLECTION",
    sizes: ["S", "M", "L"],
    colors: ["Ivory", "Mushroom"],
  },
];

// 1. QUERY: Extract the complete apparel catalog for your storefront grid
// (No lock needed -- everyone should be able to browse the public catalog.)
export const listProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

// 2. QUERY: Extract a single garment record using its type-safe Convex ID
// (No lock needed -- viewing one product is just as public as browsing all of them.)
export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// 3. MUTATION: Seed the catalog with realistic clothing imagery
// (Left unlocked deliberately -- it's already self-guarded: it only ever
// inserts data once, when the table is empty, so it's harmless either way.)
export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const existingProducts = await ctx.db.query("products").collect();

    if (existingProducts.length > 0) {
      return {
        inserted: 0,
        existing: existingProducts.length,
        message: "Catalog already populated.",
      };
    }

    const insertedIds = [] as string[];

    for (const product of initialProducts) {
      const insertedId = await ctx.db.insert("products", product);
      insertedIds.push(insertedId);
    }

    return {
      inserted: insertedIds.length,
      existing: 0,
      message: "Catalog seeded with realistic clothing imagery.",
    };
  },
});

// 4. MUTATION: Provision a fresh apparel item into the store database
// Admin-only from here down -- this changes real store data.
export const addProduct = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    price: v.number(),
    stock: v.number(),
    imageUrl: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    tag: v.optional(v.string()),
    sizes: v.optional(v.array(v.string())),
    colors: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const productId = await ctx.db.insert("products", {
      name: args.name,
      price: args.price,
      stock: args.stock,
      imageUrl: args.imageUrl,
      category: args.category,
      description: args.description,
      tag: args.tag,
      sizes: args.sizes,
      colors: args.colors,
    });
    return productId;
  },
});

// 5. MUTATION: Safely patch a product's details or adjust stock values
// Admin-only.
export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    token: v.string(),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    stock: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    tag: v.optional(v.string()),
    sizes: v.optional(v.array(v.string())),
    colors: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const { id, token, ...updates } = args;

    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error(
        `UPDATE_FAILED: Targeted garment SKU [${id}] does not exist.`,
      );
    }

    // Guard against accidentally wiping fields: only patch keys that were
    // actually provided a real value. Without this, a field left out of
    // the call (or explicitly sent as undefined by some future caller)
    // could silently erase existing data via ctx.db.patch().
    const sanitizedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );

    await ctx.db.patch(id, sanitizedUpdates);
    return { success: true };
  },
});

// 6. MUTATION: Permanently drop a clothing option from your active catalog
// Admin-only.
export const deleteProduct = mutation({
  args: { id: v.id("products"), token: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error(
        `DELETE_FAILED: Targeted garment SKU [${args.id}] does not exist.`,
      );
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
