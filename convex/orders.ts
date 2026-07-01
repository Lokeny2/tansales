import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. MUTATION: Process atomic transactions and handle stock deductions
export const placeOrder = mutation({
  args: {
    customer: v.object({
      fullName: v.string(),
      email: v.string(),
      street: v.string(),
      city: v.string(),
    }),
    items: v.array(
      v.object({
        id: v.id("products"),
        quantity: v.number(),
        size: v.string(),
        color: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    let calculatedTotal = 0;
    const verifiedItems = [];

    for (const item of args.items) {
      const product = await ctx.db.get(item.id);

      if (!product) {
        throw new Error(`Product ${item.id} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Out of stock: ${product.name}`);
      }

      // Deduct inventory items atomically
      await ctx.db.patch(product._id, {
        stock: product.stock - item.quantity,
      });

      const lineTotal = product.price * item.quantity;
      calculatedTotal += lineTotal;

      verifiedItems.push({
        productId: item.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      });
    }

    // Insert completed order transaction ticket matching schema.ts exactly
    const orderId = await ctx.db.insert("orders", {
      customer: args.customer,
      items: verifiedItems,
      totalAmount: calculatedTotal,
      fulfillmentStatus: "unfulfilled",
      paymentStatus: "paid",
      createdAt: new Date().toISOString(),
    });

    return { success: true, orderId };
  },
});

// 2. QUERY: Live stream provider required by the Admin Panel UI layout
export const getOrdersLog = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});
