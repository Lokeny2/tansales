"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
  const { getCartCount } = useCart();
  const { user, signOut } = useAuth();
  const { getWishlistCount } = useWishlist();

  return (
    <nav className="w-full border-b border-white/10 bg-obsidian/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-medium tracking-widest uppercase">
        {/* Left: Categories -- link to real categories that exist in the
            product data, so the filter actually does something. */}
        <div className="flex gap-8">
          <Link
            href="/products?category=Outerwear"
            className="hover:text-accent-lime transition-colors"
          >
            Outerwear
          </Link>
          <Link
            href="/products?category=Tees"
            className="hover:text-accent-lime transition-colors"
          >
            Tees
          </Link>
        </div>

        {/* Center: Brand Identity */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-sm font-bold tracking-[0.2em]">
          <Link href="/">Tanite</Link>
        </div>

        {/* Right: Operations */}
        <div className="flex gap-8 items-center">
          <Link
            href="/wishlist"
            className="hover:text-accent-lime transition-colors hidden md:flex items-center gap-2"
          >
            Wishlist
            {getWishlistCount() > 0 && (
              <span className="text-[10px] bg-white text-obsidian px-2 py-0.5 font-bold rounded-full transition-all duration-300">
                {getWishlistCount()}
              </span>
            )}
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
          {user ? (
            <button
              onClick={() => signOut()}
              className="hover:text-accent-lime transition-colors"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/auth"
              className="hover:text-accent-lime transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
