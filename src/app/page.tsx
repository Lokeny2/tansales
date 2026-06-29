import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/products";

// Static Editorial Collections Data
const CATEGORIES = [
  {
    name: "Tees",
    count: "14 Items",
    colorSwatch: ["#0B0F19", "#FFFFFF", "#374151"],
  },
  { name: "Hoodies", count: "9 Items", colorSwatch: ["#1F2937", "#4B5563"] },
  { name: "Outerwear", count: "6 Items", colorSwatch: ["#111827", "#D1D5DB"] },
];

export default async function HomePage() {
  // Asynchronously fetch products from our mock Data Access Layer
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24">
      {/* 1. Massive Brand Typography Header */}
      <header className="py-12 md:py-20 border-b border-white/10">
        <h1 className="text-[12vw] md:text-[11vw] font-black uppercase tracking-tighter leading-none select-none">
          Tanite Studio
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 text-xs text-gray-400 gap-4 tracking-wider uppercase">
          <p className="max-w-xs">
            Functional minimalism. High-contrast silhouettes designed for daily
            utility.
          </p>
          <p className="max-w-xs md:text-right">
            Collection 01 // All rights reserved 2026.
          </p>
        </div>
      </header>

      {/* 2. Editorial Highlight and Category Blocks */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-12 items-stretch">
        {/* Visual Focal Point Card */}
        <div className="lg:col-span-2 min-h-[350px] bg-gradient-to-br from-neutral-900 via-zinc-800 to-neutral-950 rounded-sm relative p-8 flex flex-col justify-end overflow-hidden group border border-white/10">
          <div className="absolute inset-0 bg-accent-cyan/5 opacity-40 group-hover:opacity-20 transition-opacity" />
          <div className="relative z-10 flex justify-between items-end w-full">
            <div>
              <span className="text-[10px] tracking-widest text-gray-400 block mb-1">
                DROP 01
              </span>
              <h2 className="text-xl font-bold uppercase tracking-wider">
                Neo-Utility Garments
              </h2>
            </div>
            <button className="bg-white text-obsidian text-xs font-semibold tracking-widest uppercase px-5 py-3 rounded-full hover:bg-accent-lime hover:text-white transition-all">
              Explore Drop →
            </button>
          </div>
        </div>

        {/* Quick Category Navigation Stack */}
        <div className="flex flex-col justify-between gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="glass-panel p-6 rounded-sm flex justify-between items-center hover:border-white/30 transition-colors cursor-pointer"
            >
              <div>
                <h3 className="text-sm font-bold tracking-wider uppercase">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-gray-400">{cat.count}</span>
              </div>
              <div className="flex gap-1">
                {cat.colorSwatch.map((color, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Operational Filter Strip */}
      <section className="border-t border-b border-white/10 py-4 flex justify-between items-center text-xs tracking-widest uppercase font-medium">
        <div className="flex gap-6 text-gray-400">
          <span>Filter by:</span>
          <span className="text-white cursor-pointer hover:text-accent-lime transition-colors">
            Category ▾
          </span>
          <span className="text-white cursor-pointer hover:text-accent-lime transition-colors">
            Size ▾
          </span>
          <span className="text-white cursor-pointer hover:text-accent-lime transition-colors">
            Price ▾
          </span>
        </div>
        <div className="cursor-pointer hover:text-accent-lime transition-colors">
          Search 🔍
        </div>
      </section>

      {/* 4. Product Catalog Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 py-12">
        {products.map((product) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="group flex flex-col gap-4"
          >
            {/* Optimized Next.js Image Container */}
            <div className="aspect-[3/4] bg-zinc-950 rounded-sm relative flex items-center justify-center border border-white/5 overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={product.id === "1"}
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <span className="absolute top-4 left-4 bg-obsidian/80 backdrop-blur-md px-2 py-1 text-[9px] font-bold tracking-wider uppercase rounded-sm border border-white/10 z-10">
                {product.tag}
              </span>
            </div>

            {/* Product Meta Text */}
            <div className="flex justify-between items-start text-xs tracking-wider uppercase">
              <div className="flex flex-col gap-1 max-w-[75%]">
                <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors truncate">
                  {product.name}
                </h4>
                <span className="text-[10px] text-gray-500">
                  Tanite Essentials
                </span>
              </div>
              <span className="font-semibold text-white">{product.price}</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
