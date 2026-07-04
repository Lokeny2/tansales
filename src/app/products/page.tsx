"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { useCart } from "@/context/CartContext";
import { api } from "../../../convex/_generated/api";

export default function SalesDashboard() {
  const products = useQuery(api.products.listProducts);
  const { getCartCount } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const catalog = products ?? [];

  const filteredProducts = useMemo(() => {
    let result = catalog;

    if (selectedCategory !== "ALL") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
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
      <div className="min-h-screen bg-neutral-950 text-emerald-400 flex flex-col items-center justify-center font-mono gap-3">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="animate-pulse tracking-widest text-xs">
          INITIALIZING DATA STREAM...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100 selection:bg-emerald-500/30 font-sans antialiased relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-neutral-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto p-4 sm:p-8 relative z-10">
        <header className="w-full rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
                TANITE STUDIO
              </h1>
              <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider">
                POS Mode
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-mono mt-1">
              Connected: ShardCluster.Oregon_us-west-2
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search active catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-950/60 border border-white/5 rounded-xl px-4 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors font-mono w-full sm:w-64"
            />
            <Link
              href="/cart"
              className="bg-neutral-950/60 border border-white/5 rounded-xl p-1.5 flex items-center gap-1"
            >
              <span className="text-xs font-mono text-neutral-400 px-2">
                🛒 BUCKET:
              </span>
              <span className="bg-emerald-500 text-neutral-950 text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg transition-all">
                {getCartCount()} units
              </span>
            </Link>
          </div>
        </header>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-mono tracking-wider px-4 py-2 rounded-xl transition-all border duration-200 whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-white text-black border-white font-bold"
                  : "bg-white/[0.02] text-neutral-400 border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="w-full rounded-2xl border border-white/5 bg-neutral-900/20 backdrop-blur-md p-16 text-center font-mono text-neutral-500 text-sm">
            No operational items match the current search pipeline criteria.
          </div>
        ) : (
          <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <Link
                href={`/products/${item._id}`}
                key={item._id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/20 backdrop-blur-xl p-4 transition-all duration-300 hover:border-white/10 hover:bg-neutral-900/40 shadow-lg"
              >
                <div className="absolute -inset-px -z-10 bg-gradient-to-b from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl" />

                <div>
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-950 border border-white/5">
                    {item.tag && (
                      <span className="absolute top-3 right-3 z-10 text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-neutral-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                        {item.tag}
                      </span>
                    )}
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-neutral-700 text-xs font-mono">
                        [ NO STORAGE ASSET ]
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-semibold text-neutral-200 tracking-tight group-hover:text-white transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <span className="text-sm font-mono font-bold text-emerald-400">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {item.description || "No description logged."}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-600 tracking-wider">
                    TAG: {item.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white/5 border border-white/5 text-neutral-300 px-3 py-1.5 rounded-lg group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-500 transition-all duration-200">
                    VIEW & ADD →
                  </span>
                </div>
              </Link>
            ))}
          </main>
        )}
      </div>
    </div>
  );
}
