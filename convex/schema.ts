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

  users: defineTable({
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    role: v.string(),
    createdAt: v.string(),
  }).index("by_email", ["email"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.string(),
  })
    .index("by_token", ["token"])
    .index("by_userId", ["userId"]),

  // Checkout transaction tickets ledger.
  // An order starts as "pending" the moment checkout begins, and only
  // becomes "paid" once Paystack has genuinely confirmed the charge
  // (via the verify step or the webhook) -- never based on the
  // customer's browser alone.
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
    paymentStatus: v.string(), // "pending" | "paid" | "failed"
    paystackReference: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_reference", ["paystackReference"]),
});
