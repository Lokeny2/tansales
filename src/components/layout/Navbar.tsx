import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-white/10 bg-obsidian/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-medium tracking-widest uppercase">
        
        {/* Left: Category Categories */}
        <div className="flex gap-8">
          <Link href="/products?category=men" className="hover:text-accent-lime transition-colors">
            Male
          </Link>
          <Link href="/products?category=women" className="hover:text-accent-lime transition-colors">
            Female
          </Link>
        </div>

        {/* Center: Brand Identity */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-sm font-bold tracking-[0.2em]">
          <Link href="/">
            Tanite
          </Link>
        </div>

        {/* Right: Utility Operations */}
        <div className="flex gap-8">
          <Link href="/wishlist" className="hover:text-accent-lime transition-colors hidden md:block">
            Wishlist
          </Link>
          <Link href="/cart" className="hover:text-accent-lime transition-colors flex items-center gap-1">
            My Cart <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">0</span>
          </Link>
        </div>

      </div>
    </nav>
  );
}