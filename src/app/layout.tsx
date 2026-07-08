import type { Metadata } from "next";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export const metadata: Metadata = {
  title: "Tanite Sales Studio",
  description: "High-performance clothing commerce engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Uses the theme's actual design tokens (bg-obsidian / text-foreground)
          instead of hardcoded neutral-950/100, so the whole app draws from
          one consistent source of truth defined in globals.css. */}
      <body className="antialiased bg-obsidian text-foreground">
        <ConvexClientProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                {children}
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
