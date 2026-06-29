"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Definition interface matching our data structure
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  tag: string;
  imageUrl: string;
  sizes: string[];
  colors: string[];
}

const STATIC_CATALOG: Product[] = [
  {
    id: "1",
    name: "Heavyweight Boxy Tee",
    price: 30.0,
    category: "Tees",
    tag: "NEW",
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Slate"],
  },
  {
    id: "2",
    name: "Signature Oversized Hoodie",
    price: 65.0,
    category: "Hoodies",
    tag: "PRE-ORDER",
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Charcoal"],
  },
  {
    id: "3",
    name: "Modular Canvas Jacket",
    price: 110.0,
    category: "Outerwear",
    tag: "LIMITED",
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
    sizes: ["S", "M", "L"],
    colors: ["Sand", "Olive", "Black"],
  },
];

export default function ProductsCatalogPage() {
  // Filtering and query states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [maxPrice, setMaxPrice] = useState(150);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(STATIC_CATALOG);

  // Filter processing pipeline loop
  useEffect(() => {
    let output = STATIC_CATALOG.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSize =
        selectedSize === "All" || product.sizes.includes(selectedSize);
      const matchesColor =
        selectedColor === "All" || product.colors.includes(selectedColor);
      const matchesPrice = product.price <= maxPrice;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSize &&
        matchesColor &&
        matchesPrice
      );
    });

    setFilteredProducts(output);
  }, [searchQuery, selectedCategory, selectedSize, selectedColor, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Search Header Row */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8 mb-10">
        <div>
          <span className="text-[10px] tracking-widest text-zinc-400 uppercase block mb-1">
            Catalog Index
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            All Garments
          </h1>
        </div>

        {/* Sleek Minimalist Search Bar */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Search catalog... 🔍"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-white tracking-wide uppercase"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-3 text-zinc-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Split Window Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
        {/* Sidebar Controls Panel Component */}
        <aside className="glass-panel p-6 rounded-sm space-y-8 lg:sticky lg:top-28">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300">
              Filter Framework
            </h2>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedSize("All");
                setSelectedColor("All");
                setMaxPrice(150);
                setSearchQuery("");
              }}
              className="text-[10px] text-zinc-500 hover:text-white underline uppercase tracking-wider"
            >
              Reset
            </button>
          </div>

          {/* Category List */}
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
              Category
            </label>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {["All", "Tees", "Hoodies", "Outerwear"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs uppercase tracking-wider py-1.5 px-3 lg:px-0 rounded-sm transition-all ${
                    selectedCategory === cat
                      ? "text-accent-lime font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {cat} {selectedCategory === cat && "•"}
                </button>
              ))}
            </div>
          </div>

          {/* Sizing Chips Matrix */}
          <div className="space-y-3">
            <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
              Size Dimension
            </label>
            <div className="flex flex-wrap gap-2">
              {["All", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 border text-[11px] font-bold rounded-sm transition-all flex items-center justify-center ${
                    selectedSize === size
                      ? "bg-white text-obsidian border-white"
                      : "border-white/10 text-zinc-400 hover:border-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Matrix Swatches */}
          <div className="space-y-3">
            <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
              Colorway
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Black",
                "White",
                "Slate",
                "Charcoal",
                "Sand",
                "Olive",
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1.5 border text-[10px] font-semibold rounded-sm tracking-wider uppercase transition-all ${
                    selectedColor === color
                      ? "bg-white text-obsidian border-white"
                      : "border-white/5 text-zinc-400 bg-white/[0.01] hover:border-white"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              <span>Max Cap</span>
              <span className="text-white">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-accent-cyan cursor-pointer bg-zinc-800 h-1 rounded-sm"
            />
          </div>
        </aside>

        {/* Dynamic Target Catalog Grid Output Display (Spans 3 Columns) */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 glass-panel rounded-sm border border-dashed border-white/10">
              <p className="text-xs text-zinc-500 uppercase tracking-widest">
                Zero inventory matrix rows matched your filter rules.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {filteredProducts.map((product) => (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="group flex flex-col gap-4"
                >
                  <div className="aspect-[3/4] bg-zinc-950 rounded-sm relative border border-white/5 overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <span className="absolute top-4 left-4 bg-obsidian/80 backdrop-blur-md px-2 py-1 text-[9px] font-bold tracking-wider uppercase rounded-sm border border-white/10 z-10">
                      {product.tag}
                    </span>
                  </div>
                  <div className="flex justify-between items-start text-xs tracking-wider uppercase">
                    <div className="flex flex-col gap-1 max-w-[75%]">
                      <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors truncate">
                        {product.name}
                      </h4>
                      <span className="text-[10px] text-zinc-500">
                        {product.category}
                      </span>
                    </div>
                    <span className="font-semibold text-white">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
