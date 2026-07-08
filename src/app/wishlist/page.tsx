"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center gap-6">
        <h1 className="text-4xl font-black uppercase tracking-tight text-zinc-500">
          Your Wishlist is Empty
        </h1>
        <p className="text-xs text-zinc-400 uppercase tracking-widest max-w-xs">
          Tap the heart icon on any item to save it here for later.
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
      <header className="border-b border-white/10 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-[10px] tracking-widest text-gray-400 uppercase block mb-1">
            Saved For Later
          </span>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white">
            Wishlist
          </h1>
        </div>
        <span className="text-xs text-zinc-400 tracking-widest uppercase">
          Total Items // [ {wishlist.length} ]
        </span>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {wishlist.map((item) => (
          <div key={item.id} className="group flex flex-col gap-4">
            <Link href={`/products/${item.id}`} className="block">
              <div className="aspect-[3/4] bg-zinc-950 rounded-sm relative flex items-center justify-center border border-white/5 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </Link>

            <div className="flex justify-between items-start text-xs tracking-wider uppercase">
              <div className="flex flex-col gap-1 max-w-[65%]">
                <Link href={`/products/${item.id}`}>
                  <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors truncate">
                    {item.name}
                  </h4>
                </Link>
                <span className="text-[10px] text-gray-500">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-white">
                  KSh {item.price.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => removeFromWishlist(item.id)}
                  aria-label="Remove from wishlist"
                  className="text-base leading-none text-accent-lime hover:text-red-400 transition-colors"
                >
                  &#10005;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
