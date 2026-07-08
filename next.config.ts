import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Temporary broad allowance so admin-entered image URLs from any
      // host don't crash the page. This should be narrowed once a real
      // image upload solution (see project notes) replaces free-text
      // URL entry with a single, known storage domain.
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
