// convex/payments.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

// ===== TYPE DEFINITIONS =====

interface PaystackInitResponse {
  status: boolean;
  message?: string;
  data?: {
    authorization_url: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message?: string;
  data?: {
    status: string;
    metadata?: {
      orderId?: string;
    };
  };
}

// ===== UPDATED: Make hadStockShortfall optional =====
interface FinalizeOrderResult {
  alreadyFinalized: boolean;
  hadStockShortfall?: boolean;  // ← Made optional with ?
}

// ===== ACTION: initializeCheckout =====

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
  returns: v.object({
    authorizationUrl: v.string(),
    reference: v.string(),
    orderId: v.id("orders"),
  }),
  handler: async (ctx, args): Promise<{
    authorizationUrl: string;
    reference: string;
    orderId: Id<"orders">;
  }> => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "PAYSTACK_SECRET_KEY is not configured. Add it under Convex dashboard -> Settings -> Environment Variables.",
      );
    }

    const { orderId, totalAmount }: { orderId: Id<"orders">; totalAmount: number } =
      await ctx.runMutation(internal.orders.createPendingOrder, {
        customer: args.customer,
        items: args.items,
      });

    const siteUrl = process.env.SITE_URL || "http://localhost:3000";

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

    const data: PaystackInitResponse = await response.json();

    if (!response.ok || !data.status || !data.data) {
      throw new Error(
        `Paystack initialize failed: ${data.message || response.statusText}`,
      );
    }

    await ctx.runMutation(internal.orders.attachPaymentReference, {
      orderId,
      reference: data.data.reference,
    });

    return {
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
      orderId,
    };
  },
});

// ===== ACTION: verifyPayment =====

export const verifyPayment = action({
  args: {
    reference: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.optional(v.string()),
    orderId: v.optional(v.id("orders")),
    alreadyFinalized: v.optional(v.boolean()),
    hadStockShortfall: v.optional(v.boolean()),
  }),
  handler: async (ctx, args): Promise<{
    success: boolean;
    message?: string;
    orderId?: Id<"orders">;
    alreadyFinalized?: boolean;
    hadStockShortfall?: boolean;
  }> => {
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

    const data: PaystackVerifyResponse = await response.json();

    if (!response.ok || !data.status || !data.data) {
      return {
        success: false,
        message: data.message || "Verification failed.",
      };
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

    // ===== FIXED: TypeScript now accepts this =====
    const result: FinalizeOrderResult = await ctx.runMutation(
      internal.orders.finalizeOrderPayment,
      {
        orderId,
      },
    );

    return {
      success: true,
      orderId,
      alreadyFinalized: result.alreadyFinalized,
      hadStockShortfall: result.hadStockShortfall,
    };
  },
});