import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tanite Sales | Essentialized Clothing",
  description: "High-contrast minimalist clothing retail platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}