"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cart, getCartTotal, getCartCount } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form input states
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate validation and transaction processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Optional: You could call a clearCart() helper here to empty state memory
    }, 1500);
  };

  // Check if form is ready for submission
  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== "",
  );

  // Render clean empty state if user accesses checkout page without buying items
  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center gap-6">
        <h1 className="text-4xl font-black uppercase tracking-tight text-zinc-500">
          Secure Checkout
        </h1>
        <p className="text-xs text-zinc-400 uppercase tracking-widest max-w-xs">
          Your cart is empty. Add item variants before initiating checkout
          protocols.
        </p>
        <Link
          href="/"
          className="bg-white text-obsidian font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-accent-lime hover:text-white transition-all mt-4"
        >
          Return To Studio
        </Link>
      </div>
    );
  }

  // Render Post-Submission Success Layout Screen
  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 bg-accent-lime/10 border border-accent-lime text-accent-lime rounded-full flex items-center justify-center text-xl font-bold animate-bounce">
          ✓
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
          Order Confirmed
        </h1>
        <p className="text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
          Thank you for shopping with Tanite Studio. Your simulated invoice
          transaction processed successfully. Packing protocols initialized.
        </p>
        <div className="glass-panel w-full p-4 rounded-sm text-left text-[11px] tracking-wider uppercase text-zinc-400 space-y-1">
          <p>
            Recipient:{" "}
            <strong className="text-white">{formData.fullName}</strong>
          </p>
          <p>
            Destination:{" "}
            <strong className="text-white">{formData.city}, KE</strong>
          </p>
          <p>
            Total Charge:{" "}
            <strong className="text-accent-cyan">
              ${getCartTotal().toFixed(2)}
            </strong>
          </p>
        </div>
        <Link
          href="/"
          className="w-full bg-white text-obsidian font-bold text-xs uppercase tracking-widest py-4 rounded-full hover:bg-accent-lime hover:text-white transition-all duration-300 block shadow-lg"
        >
          Continue Browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <header className="border-b border-white/10 pb-8 mb-12">
        <span className="text-[10px] tracking-widest text-gray-400 uppercase block mb-1">
          Secure Protocol
        </span>
        <h1 className="text-4xl font-black uppercase tracking-tight text-white">
          Checkout Architecture
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Left Form Grid Element (Spans 3 Columns) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 flex flex-col gap-8"
        >
          {/* Shipping Node */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-white/5 pb-2">
              01 // Shipping Logistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Alex Carter"
                  className="bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-white tracking-wide"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="alex@studio.com"
                  className="bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-white tracking-wide"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="1024 Digital Avenue"
                  className="bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-white tracking-wide"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Nairobi"
                  className="bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-white tracking-wide"
                />
              </div>
            </div>
          </div>

          {/* Payment Card Node */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-white/5 pb-2">
              02 // Simulated Gateway Credentials
            </h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                maxLength={19}
                placeholder="0000 0000 0000 0000"
                className="bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-white tracking-wide"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Expiration Date
                </label>
                <input
                  type="text"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  maxLength={5}
                  placeholder="MM/YY"
                  className="bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-white tracking-wide"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Security CVV
                </label>
                <input
                  type="password"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  maxLength={3}
                  placeholder="•••"
                  className="bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-white tracking-wide"
                />
              </div>
            </div>
          </div>

          {/* Execution Submit Trigger */}
          <button
            type="submit"
            disabled={!isFormValid || isProcessing}
            className={`w-full font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-all duration-300 shadow-xl ${
              !isFormValid
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : isProcessing
                  ? "bg-accent-cyan text-white animate-pulse"
                  : "bg-white text-obsidian hover:bg-accent-lime hover:text-white cursor-pointer"
            }`}
          >
            {isProcessing
              ? "Authorizing Order..."
              : `Authorize Payment // $${getCartTotal().toFixed(2)}`}
          </button>
        </form>

        {/* Right Dynamic Cart Sidebar Summary (Spans 2 Columns) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-sm sticky top-28 flex flex-col gap-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-white/5 pb-3">
            Review Bag [{getCartCount()}]
          </h2>

          {/* Micro Row Dynamic Line Scroll Loop */}
          <div className="max-h-64 overflow-y-auto divide-y divide-white/5 pr-2">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="py-3 flex justify-between items-center first:pt-0"
              >
                <div className="flex gap-3 items-center truncate">
                  <div className="w-10 aspect-[3/4] bg-zinc-950 relative border border-white/10 flex-shrink-0 rounded-sm">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="text-[11px] tracking-wider uppercase truncate">
                    <p className="font-bold text-white truncate max-w-[120px] md:max-w-[160px]">
                      {item.name}
                    </p>
                    <span className="text-[9px] text-zinc-400">
                      {item.size} / {item.color} (x{item.quantity})
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-white tracking-wider">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Summary Block */}
          <div className="border-t border-white/10 pt-4 space-y-2 text-xs tracking-wider uppercase">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span className="text-white font-medium">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Delivery Protocol</span>
              <span className="text-accent-lime font-medium">FREE EXPRESS</span>
            </div>
            <div className="border-t border-white/5 pt-3 flex justify-between text-sm font-bold text-white">
              <span>Grand Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
