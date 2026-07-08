"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import ProductForm from "@/components/products/ProductForm";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const product = useQuery(api.products.getProductById, {
    id: params.id as Id<"products">,
  });
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Still loading
  if (product === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
        Loading product...
      </div>
    );
  }

  // Genuinely doesn't exist
  if (product === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="text-2xl font-bold text-white">Product not found</h1>
        <p className="text-sm text-neutral-400 max-w-sm">
          This item may have been removed from the catalog.
        </p>
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-accent-lime underline"
        >
          Back to Studio
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <Link
        href="/"
        className="text-xs tracking-widest text-gray-400 hover:text-white uppercase inline-block mb-8 transition-colors"
      >
        &larr; Back to Studio
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="aspect-[3/4] w-full bg-zinc-950 rounded-sm relative border border-white/5 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover"
          />
          {product.tag && (
            <span className="absolute top-4 left-4 bg-obsidian/80 backdrop-blur-md px-2 py-1 text-[9px] font-bold tracking-wider uppercase rounded-sm border border-white/10">
              {product.tag}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-8">
          <div className="border-b border-white/10 pb-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] tracking-widest text-gray-400 uppercase block mb-2">
                  Tanite Essentials // {product.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-3">
                  {product.name}
                </h1>
              </div>
              <button
                type="button"
                onClick={() =>
                  toggleWishlist({
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    category: product.category,
                  })
                }
                aria-label={
                  wishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                className={`flex-shrink-0 text-2xl leading-none transition-colors mt-1 ${
                  wishlisted
                    ? "text-accent-lime"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {wishlisted ? "\u2665" : "\u2661"}
              </button>
            </div>
            <p className="text-xl font-medium text-white">
              KSh {product.price.toLocaleString()}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Overview
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed max-w-xl">
              {product.description || "No description available."}
            </p>
          </div>

          <ProductForm product={product} />

          <div className="text-[10px] text-zinc-500 uppercase tracking-wider space-y-1 pt-4 border-t border-white/5">
            <p>&check; Free local express shipping over KSh 15,000.</p>
            <p>&check; Wrapped in fully recycled canvas product packaging bags.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
