"use client"; // Turn into client node to allow state consumer hooks

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { getCartCount } = useCart();

  return (
    <nav className="w-full border-b border-white/10 bg-obsidian/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-medium tracking-widest uppercase">
        {/* Left: Categories */}
        <div className="flex gap-8">
          <Link
            href="/products?category=men"
            className="hover:text-accent-lime transition-colors"
          >
            Male
          </Link>
          <Link
            href="/products?category=women"
            className="hover:text-accent-lime transition-colors"
          >
            Female
          </Link>
        </div>

        {/* Center: Brand Identity */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-sm font-bold tracking-[0.2em]">
          <Link href="/">Tanite</Link>
        </div>

        {/* Right: Operations */}
        <div className="flex gap-8">
          <Link
            href="/wishlist"
            className="hover:text-accent-lime transition-colors hidden md:block"
          >
            Wishlist
          </Link>
          <Link
            href="/cart"
            className="hover:text-accent-lime transition-colors flex items-center gap-2"
          >
            My Cart
            <span className="text-[10px] bg-white text-obsidian px-2 py-0.5 font-bold rounded-full transition-all duration-300">
              {getCartCount()}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
