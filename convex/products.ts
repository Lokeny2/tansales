import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. QUERY: Extract the complete apparel catalog for your storefront grid
export const listProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

// 2. QUERY: Extract a single garment record using its type-safe Convex ID
export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) {
      throw new Error(
        `SKU_NOT_FOUND: Item reference [${args.id}] does not exist.`,
      );
    }
    return product;
  },
});

// 3. MUTATION: Provision a fresh apparel item into the store database
export const addProduct = mutation({
  args: {
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

// 4. MUTATION: Safely patch a product's details or adjust stock values
export const updateProduct = mutation({
  args: {
    id: v.id("products"),
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
    const { id, ...updates } = args;

    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error(
        `UPDATE_FAILED: Targeted garment SKU [${id}] does not exist.`,
      );
    }

    await ctx.db.patch(id, updates);
    return { success: true };
  },
});

// 5. MUTATION: Permanently drop a clothing option from your active catalog
export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
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
