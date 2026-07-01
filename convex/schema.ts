import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Canonical clothing items table
  products: defineTable({
    name: v.string(),
    price: v.number(),
    stock: v.number(),
    imageUrl: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    tag: v.optional(v.string()),
    sizes: v.optional(v.array(v.string())),
    colors: v.optional(v.array(v.string())),
  }),

  // Immutable checkout transaction tickets ledger
  orders: defineTable({
    customer: v.object({
      fullName: v.string(),
      email: v.string(),
      street: v.string(),
      city: v.string(),
    }),
    items: v.array(
      v.object({
        productId: v.string(),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        size: v.string(),
        color: v.string(),
      }),
    ),
    totalAmount: v.number(),
    fulfillmentStatus: v.string(), // "unfulfilled" | "fulfilled"
    paymentStatus: v.string(), // "paid" | "failed"
    createdAt: v.string(),
  }),
});
