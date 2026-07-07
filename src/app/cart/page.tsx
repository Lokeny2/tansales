"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, getCartTotal, getCartCount } = useCart();

  // 1. Clean Empty State Handler
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center gap-6">
        <h1 className="text-4xl font-black uppercase tracking-tight text-zinc-500">
          Your Cart is Empty
        </h1>
        <p className="text-xs text-zinc-400 uppercase tracking-widest max-w-xs">
          You haven't added any pieces from Collection 01 to your matrix yet.
        </p>
        <Link
          href="/"
          className="bg-white text-obsidian font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-accent-lime hover:text-white transition-all mt-4"
        >
          Browse Studio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      {/* Editorial Header */}
      <header className="border-b border-white/10 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-[10px] tracking-widest text-gray-400 uppercase block mb-1">
            Review Selection
          </span>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white">
            Shopping Cart
          </h1>
        </div>
        <span className="text-xs text-zinc-400 tracking-widest uppercase">
          Total Items // [ {getCartCount()} ]
        </span>
      </header>

      {/* Two Column Layout Mesh */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left Aspect: Line Item Dynamic Scroll List (Spans 2 columns) */}
        <div className="lg:col-span-2 divide-y divide-white/10">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.size}-${item.color}`}
              className="py-6 flex gap-6 items-center justify-between first:pt-0"
            >
              {/* Product Thumbnail Thumbnail */}
              <div className="flex gap-4 items-center flex-1">
                <div className="w-20 aspect-[3/4] bg-zinc-950 rounded-sm relative border border-white/5 overflow-hidden flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Meta Text Descriptions */}
                <div className="flex flex-col gap-1 text-xs tracking-wider uppercase">
                  <h3 className="font-bold text-white truncate max-w-[200px] md:max-w-sm">
                    {item.name}
                  </h3>
                  <div className="text-[10px] text-zinc-400 flex flex-wrap gap-x-4 gap-y-0.5">
                    <span>
                      Size: <strong className="text-white">{item.size}</strong>
                    </span>
                    <span>
                      Color:{" "}
                      <strong className="text-white">{item.color}</strong>
                    </span>
                    <span>
                      Qty:{" "}
                      <strong className="text-white">{item.quantity}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Aspect: Price Execution & Delete Trigger */}
              <div className="flex flex-col items-end gap-3 text-xs tracking-wider uppercase">
                <span className="font-semibold text-white">
                  KSh {(item.price * item.quantity).toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                  className="text-[10px] text-zinc-500 hover:text-red-400 underline transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Aspect: Sticky Checkout Summary Panel */}
        <div className="glass-panel p-6 rounded-sm sticky top-28 flex flex-col gap-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-white/5 pb-3">
            Order Summary
          </h2>

          {/* Pricing Ledger Layout */}
          <div className="space-y-3 text-xs tracking-wider uppercase text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-medium">
                KSh {getCartTotal().toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="text-accent-lime font-medium">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span className="text-white font-medium">KSh 0</span>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between text-sm font-bold text-white">
              <span>Estimated Total</span>
              <span>KSh {getCartTotal().toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout Conversion Link Button */}
          <Link
            href="/checkout"
            className="w-full bg-white text-obsidian text-center font-bold text-xs uppercase tracking-widest py-4 rounded-full hover:bg-accent-cyan hover:text-white transition-all duration-300 block shadow-lg mt-2"
          >
            Proceed To Checkout
          </Link>

          <div className="text-[9px] text-zinc-500 text-center uppercase tracking-widest">
            Secure transaction pipeline protocol.
          </div>
        </div>
      </div>
    </div>
  );
}
