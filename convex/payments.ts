import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

// ACTION: Called directly from the checkout page. Creates a pending
// order, then asks Paystack for a hosted payment link and hands it back
// to the browser to redirect to. Actions (unlike mutations/queries) are
// allowed to make outbound network calls -- that's the whole reason this
// lives here instead of in orders.ts.
export const initializeCheckout = action({
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
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "PAYSTACK_SECRET_KEY is not configured. Add it under Convex dashboard -> Settings -> Environment Variables.",
      );
    }

    // Step 1: create the order as "pending" -- no stock touched yet.
    const { orderId, totalAmount }: { orderId: Id<"orders">; totalAmount: number } =
      await ctx.runMutation(internal.orders.createPendingOrder, {
        customer: args.customer,
        items: args.items,
      });

    const siteUrl = process.env.SITE_URL || "http://localhost:3000";

    // Step 2: ask Paystack for a payment link. Amount must be in the
    // smallest unit of the currency (cents, for USD).
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: args.customer.email,
        amount: Math.round(totalAmount * 100),
        currency: "USD",
        callback_url: `${siteUrl}/checkout/complete`,
        metadata: { orderId },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      throw new Error(
        `Paystack initialize failed: ${data.message || response.statusText}`,
      );
    }

    // Step 3: remember which Paystack reference belongs to this order,
    // so the webhook and verify step can both find it later.
    await ctx.runMutation(internal.orders.attachPaymentReference, {
      orderId,
      reference: data.data.reference,
    });

    return {
      authorizationUrl: data.data.authorization_url as string,
      reference: data.data.reference as string,
      orderId,
    };
  },
});

// ACTION: Called from the /checkout/complete page once the customer's
// browser returns from Paystack. Independently asks Paystack "did this
// really succeed?" rather than trusting the URL the browser landed on --
// a browser redirect alone can be manipulated or can simply never arrive
// (closed tab, dead connection), so this is a genuine server-to-server
// confirmation, not a rubber stamp.
export const verifyPayment = action({
  args: { reference: v.string() },
  handler: async (ctx, args) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "PAYSTACK_SECRET_KEY is not configured. Add it under Convex dashboard -> Settings -> Environment Variables.",
      );
    }

    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(args.reference)}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
      },
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return { success: false, message: data.message || "Verification failed." };
    }

    const transaction = data.data;

    if (transaction.status !== "success") {
      return {
        success: false,
        message: `Payment was not successful (status: ${transaction.status}).`,
      };
    }

    const orderId = transaction.metadata?.orderId as Id<"orders"> | undefined;
    if (!orderId) {
      return {
        success: false,
        message: "Payment succeeded but no order reference was found.",
      };
    }

    const result = await ctx.runMutation(internal.orders.finalizeOrderPayment, {
      orderId,
    });

    return { success: true, orderId, ...result };
  },
});
