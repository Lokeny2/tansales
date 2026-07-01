import type { Metadata } from "next";
import "./globals.css"; // Keep your existing global styles import
import ConvexClientProvider from "./ConvexClientProvider";
import { AuthProvider } from "@/context/AuthContext";

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
      <body className="antialiased bg-neutral-950 text-neutral-100">
        {/* Injecting the connection context around the view tree */}
        <ConvexClientProvider>
          <AuthProvider>{children}</AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
