"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface ProductRecord {
  _id: Id<"products">;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: string;
  description?: string;
  tag?: string;
  sizes?: string[];
  colors?: string[];
}

export default function AdminProductsPage() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    tag: "NEW",
    imageUrl: "",
    description: "",
    sizes: "",
    colors: "",
  });

  const [editingProductId, setEditingProductId] =
    useState<Id<"products"> | null>(null);
  const products = useQuery(api.products.listProducts) as
    ProductRecord[] | undefined;
  const addProduct = useMutation(api.products.addProduct);
  const updateProduct = useMutation(api.products.updateProduct);
  const deleteProduct = useMutation(api.products.deleteProduct);

  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      tag: "NEW",
      imageUrl: "",
      description: "",
      sizes: "",
      colors: "",
    });
    setEditingProductId(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startEditing = (product: ProductRecord) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name,
      price: String(product.price),
      category: product.category,
      tag: product.tag || "NEW",
      imageUrl: product.imageUrl || "",
      description: product.description || "",
      sizes: product.sizes?.join(", ") || "",
      colors: product.colors?.join(", ") || "",
    });
  };

  const handleDelete = async (productId: Id<"products">) => {
    try {
      await deleteProduct({ id: productId });
      if (editingProductId === productId) {
        resetForm();
      }
      setStatus({
        type: "success",
        message: "✅ SKU REMOVED SUCCESSFULLY",
      });
    } catch (error: any) {
      console.error("Product deletion failure:", error);
      setStatus({
        type: "error",
        message: `❌ DELETE EXCEPTION: ${error.message}`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({
      type: "loading",
      message: "⚡ EXECUTING DB TRANSACTION PIPELINE...",
    });

    const payload = {
      name: formData.name,
      price: Number(formData.price),
      imageUrl: formData.imageUrl,
      category: formData.category,
      description: formData.description || undefined,
      tag: formData.tag || "NEW",
      sizes: formData.sizes
        ? formData.sizes.split(",").map((s) => s.trim())
        : [],
      colors: formData.colors
        ? formData.colors.split(",").map((c) => c.trim())
        : [],
    };

    try {
      if (editingProductId) {
        await updateProduct({ id: editingProductId, ...payload });
        setStatus({
          type: "success",
          message: `✅ SKU UPDATED SUCCESSFULLY: [ ID: ${editingProductId} ]`,
        });
      } else {
        const productId = await addProduct({ ...payload, stock: 0 });
        setStatus({
          type: "success",
          message: `✅ SKU LOGGED SUCCESSFULLY: [ ID: ${productId} ]`,
        });
      }
      resetForm();
    } catch (error: any) {
      console.error("Database write failure:", error);
      setStatus({
        type: "error",
        message: `❌ PIPELINE EXCEPTION: ${error.message}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 selection:bg-emerald-500/30 font-sans">
      {/* Structural Header */}
      <header className="max-w-3xl mx-auto mb-10 flex justify-between items-end border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-neutral-100 to-neutral-500 bg-clip-text text-transparent">
            CONTROL CENTER
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            [ inventory_provisioning_pipeline.v1 ]
          </p>
        </div>
        <a
          href="/products"
          className="text-xs font-mono text-neutral-400 hover:text-white border border-neutral-800 bg-neutral-900/50 px-3 py-1.5 rounded-md transition-colors"
        >
          ← VIEW LIVE CATALOG
        </a>
      </header>

      <main className="max-w-3xl mx-auto">
        <div className="mb-8 rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                EXISTING SKUS
              </p>
              <p className="text-sm text-neutral-400">
                {products?.length ?? 0} products available in Convex
              </p>
            </div>
            {editingProductId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-mono text-neutral-300"
              >
                CANCEL EDIT
              </button>
            )}
          </div>

          <div className="mt-4 space-y-2">
            {products?.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {product.name}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-500">
                    {product.category} • stock {product.stock}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(product)}
                    className="rounded border border-neutral-700 px-2.5 py-1 text-[11px] font-mono text-neutral-300"
                  >
                    EDIT
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(product._id)}
                    className="rounded border border-rose-800/50 px-2.5 py-1 text-[11px] font-mono text-rose-300"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Glassmorphic Form Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Name and Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Minimalist Kuro Hoodie"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors placeholder:text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-neutral-600 transition-colors placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Row 2: Category and Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="outerwear, pants, shirts"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors placeholder:text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Release Status Tag
                </label>
                <select
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors"
                >
                  <option value="NEW">NEW</option>
                  <option value="ESSENTIAL">ESSENTIAL</option>
                  <option value="LIMITED">LIMITED</option>
                  <option value="CONCEPT">CONCEPT</option>
                </select>
              </div>
            </div>

            {/* Row 3: Image URL */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                Image Resource URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors placeholder:text-neutral-600 font-mono"
              />
            </div>

            {/* Row 4: Variants (Sizes & Colors) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Sizes
                </label>
                <span className="block text-[10px] text-neutral-600 font-mono mb-2">
                  Separate with commas (S, M, L)
                </span>
                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleChange}
                  placeholder="S, M, L, XL"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors placeholder:text-neutral-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Colorways
                </label>
                <span className="block text-[10px] text-neutral-600 font-mono mb-2">
                  Separate with commas
                </span>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleChange}
                  placeholder="Matte Black, Vintage Grey"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Row 5: Description */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                Product Architectural Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe material compositions, weave patterns, or tailored drop configurations..."
                className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors placeholder:text-neutral-600 leading-relaxed resize-none"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Status Output Console */}
              <div className="flex-1 min-w-0">
                {status.type !== "idle" && (
                  <p
                    className={`text-xs font-mono truncate px-3 py-2 rounded border ${
                      status.type === "loading"
                        ? "bg-neutral-900 text-neutral-400 border-neutral-800 animate-pulse"
                        : status.type === "success"
                          ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-950/30 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {status.message}
                  </p>
                )}
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={status.type === "loading"}
                className="sm:w-auto px-6 py-2.5 rounded-lg text-sm font-mono font-bold bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 transition-all cursor-pointer shadow-lg active:scale-98 whitespace-nowrap"
              >
                {editingProductId
                  ? "UPDATE SKU IN ATLAS"
                  : "COMMIT SKU TO ATLAS"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
