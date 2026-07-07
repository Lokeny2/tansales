import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

// Computes an HMAC-SHA512 signature the same way Paystack does, so we can
// compare it against the x-paystack-signature header. Using the Web
// Crypto API (crypto.subtle) here for the same reason auth.ts does --
// it's available directly in Convex's default runtime, no Node-only
// imports required.
async function computeHmacSha512Hex(message: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  const bytes = new Uint8Array(signatureBuffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const http = httpRouter();

http.route({
  path: "/paystack/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error("PAYSTACK_SECRET_KEY is not configured.");
      return new Response("Server misconfigured", { status: 500 });
    }

    const signature = request.headers.get("x-paystack-signature");
    if (!signature) {
      return new Response("Missing signature", { status: 400 });
    }

    // Read the RAW body text (not a parsed/re-serialized object) --
    // Paystack signs the exact bytes it sent, so verifying against
    // anything else could silently fail or, worse, be tricked.
    const rawBody = await request.text();

    const expectedSignature = await computeHmacSha512Hex(rawBody, secretKey);

    if (expectedSignature !== signature) {
      // Someone (or something) sent a request claiming to be Paystack
      // without knowing the real secret key -- reject it outright.
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const orderId = event.data?.metadata?.orderId as Id<"orders"> | undefined;
      if (orderId) {
        try {
          await ctx.runMutation(internal.orders.finalizeOrderPayment, { orderId });
        } catch (error) {
          console.error("Failed to finalize order from webhook:", error);
          // Still acknowledge receipt below -- Paystack will otherwise
          // keep retrying an event we've already understood, even if
          // our own bookkeeping had a hiccup. We've logged it for
          // manual follow-up instead.
        }
      }
    }

    // Acknowledge receipt. Without a 200 here, Paystack assumes delivery
    // failed and will keep retrying this same event for hours.
    return new Response("OK", { status: 200 });
  }),
});

export default http;
