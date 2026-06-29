import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  // Await params in modern Next.js environments
  const { id } = await params;
  const product = await getProductById(id);

  // Trigger Next.js 404 page if item doesn't exist
  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20" >
      {/* Back to Catalog Breadcrumb Link */}
      <Link
        href="/"
        className="text-xs tracking-widest text-gray-400 hover:text-white uppercase inline-block mb-8 transition-colors"
      >
        ← Back to Studio
      </Link>

      {/* Main Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Premium Framed Product Display */}
        <div className="aspect-[3/4] w-full bg-zinc-950 rounded-sm relative border border-white/5 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover"
          />
          <span className="absolute top-4 left-4 bg-obsidian/80 backdrop-blur-md px-2 py-1 text-[9px] font-bold tracking-wider uppercase rounded-sm border border-white/10">
            {product.tag}
          </span>
        </div>

        {/* Right Column: Editorial Product Metadata & Selection Controls */}
        <div className="flex flex-col gap-8">
          {/* Header Copy */}
          <div className="border-b border-white/10 pb-6">
            <span className="text-[10px] tracking-widest text-gray-400 uppercase block mb-2">
              Tanite Essentials // {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-3">
              {product.name}
            </h1>
            <p className="text-xl font-medium text-white">{product.price}</p>
          </div>

          {/* Description Block */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Overview
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed max-w-xl">
              {product.description}
            </p>
          </div>

          {/* Sizing Selector Chips Section */}
          <div>
            <div className="flex justify-between items-center mb-3 text-xs font-bold uppercase tracking-widest">
              <span className="text-gray-400">Select Size</span>
              <span className="text-zinc-500 underline cursor-pointer hover:text-white transition-colors">
                Size Guide
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className="w-12 h-12 text-xs font-bold border border-white/10 rounded-sm hover:border-white text-gray-300 hover:text-white transition-all uppercase flex items-center justify-center focus:bg-white focus:text-obsidian focus:border-white"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette Choice Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
              Colorway
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className="px-4 py-2 text-xs font-semibold border border-white/10 rounded-sm hover:border-white text-gray-300 hover:text-white transition-all uppercase focus:border-white focus:text-white"
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Major Conversion Call To Action Button */}
          <button className="w-full bg-white text-obsidian font-bold text-xs uppercase tracking-widest py-4 mt-4 rounded-full hover:bg-accent-lime hover:text-white transition-all shadow-xl">
            Add To Cart
          </button>

          {/* Minimalist Logistics Disclaimers */}
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider space-y-1 pt-4 border-t border-white/5">
            <p>✓ Free local express shipping over $150.</p>
            <p>✓ Wrapped in fully recycled canvas product packaging bags.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
