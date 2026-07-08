"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { api } from "../../../convex/_generated/api";

function ProductsPageContent() {
  const products = useQuery(api.products.listProducts);
  const { getCartCount } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Pick up an initial category from the URL (e.g. /products?category=Tees).
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl.toUpperCase());
    }
  }, [searchParams]);

  const catalog = products ?? [];

  const filteredProducts = useMemo(() => {
    let result = catalog;

    if (selectedCategory !== "ALL") {
      result = result.filter(
        (p) => p.category.toUpperCase() === selectedCategory.toUpperCase(),
      );
    }

    if (searchQuery.trim() !== "") {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return result;
  }, [catalog, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(catalog.map((p) => p.category.toUpperCase())),
    );
    return ["ALL", ...uniqueCategories];
  }, [catalog]);

  if (products === undefined) {
    return (
      <div className="min-h-screen bg-obsidian text-neutral-400 flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-accent-lime border-t-transparent rounded-full animate-spin"></div>
        <span className="animate-pulse tracking-widest text-xs uppercase">
          Loading catalog...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-neutral-100 selection:bg-accent-lime/20">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <header className="border-b border-white/10 pb-8 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-[10px] tracking-widest text-gray-400 uppercase block mb-1">
              Full Collection
            </span>
            <h1 className="text-4xl font-black uppercase tracking-tight text-white">
              Shop All
            </h1>
          </div>
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/[0.02] border border-white/5 rounded-full px-5 py-2.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-white/20 transition-colors w-full md:w-64"
          />
        </header>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none text-[10px] tracking-widest uppercase">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full transition-all border duration-200 whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-white text-obsidian border-white font-bold"
                  : "bg-white/[0.02] text-neutral-400 border-white/5 hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="glass-panel rounded-sm p-16 text-center text-neutral-500 text-xs uppercase tracking-widest">
            No items match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map((item) => {
              const wishlisted = isWishlisted(item._id);
              return (
                <div key={item._id} className="group flex flex-col gap-4">
                  <Link href={`/products/${item._id}`} className="block">
                    <div className="aspect-[3/4] bg-zinc-950 rounded-sm relative flex items-center justify-center border border-white/5 overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {item.tag && (
                        <span className="absolute top-4 left-4 bg-obsidian/80 backdrop-blur-md px-2 py-1 text-[9px] font-bold tracking-wider uppercase rounded-sm border border-white/10 z-10">
                          {item.tag}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="flex justify-between items-start text-xs tracking-wider uppercase">
                    <div className="flex flex-col gap-1 max-w-[65%]">
                      <Link href={`/products/${item._id}`}>
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
                        onClick={() =>
                          toggleWishlist({
                            id: item._id,
                            name: item.name,
                            price: item.price,
                            imageUrl: item.imageUrl,
                            category: item.category,
                          })
                        }
                        aria-label={
                          wishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        className={`text-base leading-none transition-colors ${
                          wishlisted
                            ? "text-accent-lime"
                            : "text-gray-500 hover:text-white"
                        }`}
                      >
                        {wishlisted ? "\u2665" : "\u2661"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-obsidian flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-accent-lime border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
