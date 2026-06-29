"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/products";

interface ProductFormProps {
  product: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const { addToCart } = useCart();
  
  // Track selected attributes
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  // Parse string price (e.g., "$30.0") to a pure calculation number for the cart engine
  const numericPrice = parseFloat(product.price.replace("$", ""));

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;

    setIsAdding(true);

    // Simulate a brief 500ms micro-animation delay
    setTimeout(() => {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: numericPrice,
          size: selectedSize,
          color: selectedColor,
          imageUrl: product.imageUrl,
        },
        1 // Default quantity increment
      );
      
      setIsAdding(false);
    }, 500);
  };

  // Button verification guards
  const isButtonDisabled = !selectedSize || !selectedColor || isAdding;

  return (
    <div className="flex flex-col gap-8">
      
      {/* Sizing Selector Chips Section */}
      <div>
        <div className="flex justify-between items-center mb-3 text-xs font-bold uppercase tracking-widest">
          <span className="text-gray-400">Select Size</span>
          <span className="text-zinc-500 underline cursor-pointer hover:text-white transition-colors">Size Guide</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 text-xs font-bold border rounded-sm transition-all uppercase flex items-center justify-center ${
                  isSelected
                    ? "bg-white text-obsidian border-white"
                    : "border-white/10 text-gray-300 hover:border-white"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Palette Choice Section */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Colorway</h3>
        <div className="flex flex-wrap gap-3">
          {product.colors.map((color) => {
            const isSelected = selectedColor === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 text-xs font-semibold border rounded-sm transition-all uppercase ${
                  isSelected
                    ? "bg-white text-obsidian border-white"
                    : "border-white/10 text-gray-300 hover:border-white"
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Call To Action Button with contextual styling hooks */}
      <button
        type="button"
        disabled={isButtonDisabled}
        onClick={handleAddToCart}
        className={`w-full font-bold text-xs uppercase tracking-widest py-4 mt-4 rounded-full transition-all duration-300 shadow-xl ${
          !selectedSize || !selectedColor
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
            : isAdding
            ? "bg-accent-cyan text-white animate-pulse"
            : "bg-white text-obsidian hover:bg-accent-lime hover:text-white cursor-pointer"
        }`}
      >
        {!selectedSize || !selectedColor
          ? "Select Size & Colorway"
          : isAdding
          ? "Adding to Cart..."
          : "Add To Cart"}
      </button>
    </div>
   );
}