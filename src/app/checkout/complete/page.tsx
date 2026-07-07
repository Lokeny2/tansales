"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCart } from "@/context/CartContext";

function CheckoutCompleteContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const verifyPayment = useAction(api.payments.verifyPayment);
  const { clearCart } = useCart();

  const [status, setStatus] = useState<"checking" | "success" | "failed">(
    "checking",
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference was found in the URL.");
      return;
    }

    let didCancel = false;

    // The real confirmation happens here: we ask Paystack directly,
    // through our own server (Convex), whether this payment actually
    // succeeded -- we never trust the mere fact that the browser landed
    // on this page as proof of anything.
    verifyPayment({ reference })
      .then((result) => {
        if (didCancel) return;
        if (result.success) {
          setStatus("success");
          clearCart();
        } else {
          setStatus("failed");
          setMessage(result.message || "Payment could not be confirmed.");
        }
      })
      .catch((error) => {
        if (didCancel) return;
        setStatus("failed");
        setMessage(error.message || "Something went wrong verifying payment.");
      });

    return () => {
      didCancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-8 h-8 border-2 border-accent-lime border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
          Confirming your payment with Paystack...
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-6 selection:bg-accent-lime/20">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full border border-white/5 bg-white/[0.01] backdrop-blur-xl text-center space-y-6">
          <div className="w-12 h-12 bg-accent-lime/10 border border-accent-lime/30 text-accent-lime rounded-full flex items-center justify-center text-xl font-mono mx-auto">
            OK
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase tracking-wider text-white font-mono">
              PAYMENT_CONFIRMED
            </h1>
            <p className="text-[11px] text-zinc-400 uppercase tracking-widest leading-relaxed">
              Your payment was verified directly with Paystack and your order
              has been placed. A confirmation has been sent to your email.
            </p>
          </div>
          <Link
            href="/"
            className="w-full bg-white text-black font-mono font-black text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-accent-lime hover:text-black transition-all duration-300 block"
          >
            RETURN_TO_STUDIO
          </Link>
        </div>
      </div>
    );
  }

  // status === "failed"
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-6 selection:bg-accent-lime/20">
      <div className="glass-panel p-8 rounded-2xl max-w-md w-full border border-red-500/20 bg-white/[0.01] backdrop-blur-xl text-center space-y-6">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full flex items-center justify-center text-xl font-mono mx-auto">
          X
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-black uppercase tracking-wider text-white font-mono">
            PAYMENT_NOT_CONFIRMED
          </h1>
          <p className="text-[11px] text-zinc-400 uppercase tracking-widest leading-relaxed">
            {message ||
              "We couldn't confirm this payment. If you were charged, please contact support with your reference."}
          </p>
        </div>
        <Link
          href="/checkout"
          className="w-full bg-white text-black font-mono font-black text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-accent-lime hover:text-black transition-all duration-300 block"
        >
          RETURN_TO_CHECKOUT
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent-lime border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutCompleteContent />
    </Suspense>
  );
}
