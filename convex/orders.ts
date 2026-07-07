import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { requireAdmin } from "./authHelpers";

// INTERNAL -- called only from convex/payments.ts (never directly by the
// browser). Creates the order in "pending" state and deliberately does
// NOT touch stock yet -- stock is only ever deducted once payment is
// genuinely confirmed, in finalizeOrderPayment below. This avoids the
// old bug where an abandoned or failed checkout still silently ate into
// real inventory.
export const createPendingOrder = internalMutation({
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
  returns: v.object({
    orderId: v.id("orders"),
    totalAmount: v.number(),
  }),
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

      // Price always comes from the real database record, never from
      // whatever the browser happened to send -- this is what stops a
      // tampered client from checking out at a fake, lower price.
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

    const orderId = await ctx.db.insert("orders", {
      customer: args.customer,
      items: verifiedItems,
      totalAmount: calculatedTotal,
      fulfillmentStatus: "unfulfilled",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    });

    return { orderId, totalAmount: calculatedTotal };
  },
});

// INTERNAL -- records the Paystack reference on the order once Paystack
// has handed one back, so the webhook and verify step can both find
// their way back to the right order later.
export const attachPaymentReference = internalMutation({
  args: {
    orderId: v.id("orders"),
    reference: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { paystackReference: args.reference });
    return null;
  },
});

// INTERNAL -- the only place an order is ever actually marked "paid" and
// stock is actually deducted. Designed to be safe to call more than once
// for the same order (both the browser's verify step AND the webhook may
// try to call this for the same successful payment) -- the very first
// check makes every call after the first one a harmless no-op.
export const finalizeOrderPayment = internalMutation({
  args: { orderId: v.id("orders") },
  returns: v.object({
    alreadyFinalized: v.boolean(),
    hadStockShortfall: v.optional(v.boolean()),
  }),
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error(`ORDER_NOT_FOUND: ${args.orderId}`);
    }

    if (order.paymentStatus === "paid") {
      // Already handled by an earlier call -- nothing more to do.
      return { alreadyFinalized: true };
    }

    // Deduct stock now, for real. If something else has sold out this
    // exact item in the time between checkout starting and payment
    // clearing, we don't throw (the customer's money has already been
    // taken by Paystack at this point) -- instead we clamp stock at 0
    // and leave the order flagged for manual review via its
    // fulfillmentStatus, rather than leaving a paid order stuck as
    // "pending" forever.
    let hadStockShortfall = false;

    for (const item of order.items) {
      // item.productId is stored as a plain string snapshot (see
      // schema.ts), but it always originates from a real
      // v.id("products") value at order-creation time -- so this cast
      // is safe, unlike the previous "as any" which hid real type
      // errors instead of fixing them.
      const product = await ctx.db.get(item.productId as Id<"products">);
      if (!product) continue;

      const newStock = product.stock - item.quantity;
      if (newStock < 0) {
        hadStockShortfall = true;
      }
      await ctx.db.patch(product._id, { stock: Math.max(newStock, 0) });
    }

    await ctx.db.patch(args.orderId, {
      paymentStatus: "paid",
      fulfillmentStatus: hadStockShortfall
        ? "needs_review"
        : order.fulfillmentStatus,
    });

    return { alreadyFinalized: false, hadStockShortfall };
  },
});

// QUERY: Live stream provider required by the Admin Panel UI layout
// Admin-only -- this exposes every customer's name, email, and address,
// so only a verified admin token should ever be able to call it.
export const getOrdersLog = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    return await ctx.db.query("orders").order("desc").collect();
  },
});
