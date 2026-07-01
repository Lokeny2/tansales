"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cart, getCartTotal, getCartCount } = useCart();
  const placeOrder = useMutation(api.orders.placeOrder);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Logistics tracking state fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    street: "",
    city: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Live Async Database Form Handler Execution Loop
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      await placeOrder({
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          street: formData.street,
          city: formData.city,
        },
        items: cart.map((item) => ({
          id: item.id as Id<"products">,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      });

      setIsSuccess(true);
    } catch (error: any) {
      console.error("Checkout validation operation exception error:", error);
      setErrorMessage(
        error.message ||
          "Network pipeline exception error. Check terminal logs.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== "",
  );

  // Render empty bag layout state
  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center px-6 selection:bg-accent-lime/20">
        <div className="glass-panel p-8 rounded-2xl max-w-sm border border-white/5 bg-white/[0.01] backdrop-blur-xl space-y-6">
          <h1 className="text-2xl font-black uppercase tracking-mono text-zinc-500 font-mono">
            SECURE_CHECKOUT
          </h1>
          <p className="text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
            Your ledger buffer is empty. Add item variants before initiating
            transaction protocols.
          </p>
          <Link
            href="/"
            className="w-full bg-white text-black font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-accent-lime hover:text-black transition-all block text-center"
          >
            RETURN_TO_STUDIO
          </Link>
        </div>
      </div>
    );
  }

  // Live Database Transaction Confirmation View
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-6 selection:bg-accent-lime/20">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full border border-white/5 bg-white/[0.01] backdrop-blur-xl text-center space-y-6">
          <div className="w-12 h-12 bg-accent-lime/10 border border-accent-lime/30 text-accent-lime rounded-full flex items-center justify-center text-md font-mono mx-auto animate-pulse">
            ✓
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase tracking-wider text-white font-mono">
              RECORD_COMMITTED
            </h1>
            <p className="text-[11px] text-zinc-400 uppercase tracking-widest leading-relaxed">
              Transaction payload ingested seamlessly into cloud database log
              tree. Fulfillment pipeline initialized.
            </p>
          </div>

          <div className="border border-white/5 bg-black/40 p-4 rounded-xl text-left text-[11px] tracking-wider uppercase font-mono text-zinc-400 space-y-1.5">
            <p>
              RECIPIENT:{" "}
              <strong className="text-white font-sans">
                {formData.fullName}
              </strong>
            </p>
            <p>
              DESTINATION:{" "}
              <strong className="text-white font-sans">
                {formData.city}, KE
              </strong>
            </p>
            <p>
              CHARGED VALUE:{" "}
              <strong className="text-accent-cyan font-sans">
                ${getCartTotal().toFixed(2)}
              </strong>
            </p>
          </div>

          <Link
            href="/"
            className="w-full bg-white text-black font-mono font-black text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-accent-lime hover:text-black transition-all duration-300 block"
          >
            RESET_STUDIO_INVENTORY
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-accent-lime/20">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Architecture Header */}
        <header className="border-b border-white/5 pb-6 mb-12 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
              SYS // LIVE_PIPELINE
            </span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white font-mono">
              CHECKOUT_ARCHITECTURE
            </h1>
          </div>
          <div className="text-right font-mono text-[10px] text-zinc-500 hidden sm:block">
            ACTIVE_STREAM // {getCartCount()} ITEMS
          </div>
        </header>

        {errorMessage && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-mono rounded-xl p-4 mb-8 uppercase tracking-wider">
            ⚠ INGESTION_CRASH: {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Checkout Data Form Group */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 flex flex-col gap-10"
          >
            {/* Form Section 1 */}
            <div className="flex flex-col gap-6">
              <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5 pb-2">
                01 // SHIPPING_LOGISTICS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Alex Carter"
                    className="bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-zinc-700"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="alex@studio.com"
                    className="bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono placeholder:text-zinc-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="1024 Digital Avenue"
                    className="bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-zinc-700"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Nairobi"
                    className="bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-zinc-700"
                  />
                </div>
              </div>
            </div>

            {/* Form Section 2 */}
            <div className="flex flex-col gap-6">
              <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5 pb-2">
                02 // SIMULATED_GATEWAY_CREDENTIALS
              </h2>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  required
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  maxLength={19}
                  placeholder="0000 0000 0000 0000"
                  className="bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono placeholder:text-zinc-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    required
                    value={formData.expiry}
                    onChange={handleInputChange}
                    maxLength={5}
                    placeholder="MM/YY"
                    className="bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono placeholder:text-zinc-700"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    Security CVV
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    required
                    value={formData.cvv}
                    onChange={handleInputChange}
                    maxLength={3}
                    placeholder="•••"
                    className="bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono placeholder:text-zinc-700"
                  />
                </div>
              </div>
            </div>

            {/* Submission Controller */}
            <button
              type="submit"
              disabled={!isFormValid || isProcessing}
              className={`w-full font-mono font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-xl border cursor-pointer active:scale-99 ${
                !isFormValid
                  ? "bg-neutral-900 text-zinc-600 border-white/5 cursor-not-allowed"
                  : isProcessing
                    ? "bg-accent-cyan text-black border-transparent animate-pulse"
                    : "bg-white text-black border-transparent hover:bg-accent-lime"
              }`}
            >
              {isProcessing
                ? "TRANSMITTING_TRANSACTION..."
                : `COMMIT_LEDGER_RECORD // $${getCartTotal().toFixed(2)}`}
            </button>
          </form>

          {/* Dynamic Summary Review Columns */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-12 flex flex-col gap-6 shadow-2xl">
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 border-b border-white/5 pb-3">
              BUFFERED_ITEMS [{getCartCount()}]
            </h2>

            {/* Order Flow Feed list */}
            <div className="max-h-64 overflow-y-auto divide-y divide-white/5 pr-1 custom-scrollbar">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="py-3 flex justify-between items-center first:pt-0"
                >
                  <div className="flex gap-3 items-center truncate">
                    <div className="w-10 aspect-[3/4] bg-neutral-950 relative border border-white/5 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="text-[11px] tracking-wider uppercase font-mono truncate">
                      <p className="font-bold text-neutral-200 truncate max-w-[120px] md:max-w-[160px] font-sans">
                        {item.name}
                      </p>
                      <span className="text-[9px] text-zinc-500 block mt-0.5">
                        {item.size} // {item.color} (x{item.quantity})
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-300 tracking-wider">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Deck */}
            <div className="border-t border-white/5 pt-4 space-y-2.5 text-xs tracking-wider uppercase font-mono">
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>AGGREGATE SUB-TOTAL</span>
                <span className="text-neutral-300 font-medium">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>DELIVERY ROUTE</span>
                <span className="text-accent-lime font-bold">FREE_EXPRESS</span>
              </div>
              <div className="border-t border-white/5 pt-3 flex justify-between text-sm font-bold text-white">
                <span>TOTAL CHARGE</span>
                <span className="text-accent-cyan">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
