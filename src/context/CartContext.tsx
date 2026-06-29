"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Define the shape of an item inside our shopping cart
export interface CartItem {
  id: string;
  name: string;
  price: number; // Stored as a pure number for mathematical calculations
  size: string;
  color: string;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Load initial cart memory from local storage safely on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("tanite_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart storage data", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. Synchronize local storage state whenever the cart array updates
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("tanite_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (newItem: Omit<CartItem, "quantity">, quantity: number) => {
    setCart((prevCart) => {
      // Check if an identical product variation (same ID, same size, same color) is already in the cart
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      if (existingItemIndex > -1) {
        // Increment quantity of existing match
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      }

      // Add a brand new item variant row
      return [...prevCart, { ...newItem, quantity }];
    });
  };

  const removeFromCart = (id: string, size: string, color: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === id && item.size === size && item.color === color)
      )
    );
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getCartCount, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for consuming our cart logic anywhere across the application
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be executed within a valid CartProvider wrapper");
  }
  return context;
}