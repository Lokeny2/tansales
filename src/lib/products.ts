export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  tag: string;
  imageUrl: string;
  description: string;
  sizes: string[];
  colors: string[];
}

const TANITE_DATABASE_MOCK: Product[] = [
  {
    id: "1",
    name: "Studio Oversized Hoodie",
    price: "$96.0",
    category: "Hoodies",
    tag: "NEW",
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
    description:
      "A relaxed heavyweight hoodie with a clean architectural silhouette and premium cotton shell.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Stone"],
  },
  {
    id: "2",
    name: "Minimal Tailored Coat",
    price: "$148.0",
    category: "Outerwear",
    tag: "LIMITED",
    imageUrl:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000&auto=format&fit=crop",
    description:
      "A structured outer layer designed for sharp lines, long drape, and everyday versatility.",
    sizes: ["S", "M", "L"],
    colors: ["Camel", "Charcoal"],
  },
  {
    id: "3",
    name: "Utility Denim Jacket",
    price: "$112.0",
    category: "Jackets",
    tag: "ESSENTIAL",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    description:
      "A lightly washed denim jacket with utility pockets and a refined, modern fit.",
    sizes: ["M", "L", "XL"],
    colors: ["Indigo", "Stone"],
  },
  {
    id: "4",
    name: "Contour Knit Tee",
    price: "$54.0",
    category: "Tees",
    tag: "BESTSELLER",
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop",
    description:
      "A premium knit tee with a sculpted shape and elegant drape for minimal daily wear.",
    sizes: ["S", "M", "L"],
    colors: ["Cream", "Black"],
  },
  {
    id: "5",
    name: "Sculpted Wool Blazer",
    price: "$176.0",
    category: "Blazers",
    tag: "EDITOR'S PICK",
    imageUrl:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
    description:
      "Sharp tailoring with soft structure and a modern masculine silhouette for elevated dressing.",
    sizes: ["S", "M", "L"],
    colors: ["Midnight", "Grey"],
  },
  {
    id: "6",
    name: "Soft Tech Jogger",
    price: "$88.0",
    category: "Pants",
    tag: "TRENDING",
    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
    description:
      "A streamlined jogger made for movement, comfort, and a polished city-ready look.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Graphite", "Olive"],
  },
  {
    id: "7",
    name: "Cropped Shell Jacket",
    price: "$124.0",
    category: "Outerwear",
    tag: "NEW",
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
    description:
      "A weather-ready shell jacket that pairs refined utility details with a sleek cropped fit.",
    sizes: ["S", "M", "L"],
    colors: ["Sand", "Black"],
  },
  {
    id: "8",
    name: "Minimalist Knit Set",
    price: "$132.0",
    category: "Sets",
    tag: "COLLECTION",
    imageUrl:
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=1000&auto=format&fit=crop",
    description:
      "An elevated matching set with relaxed proportions and a soft, textural finish.",
    sizes: ["S", "M", "L"],
    colors: ["Ivory", "Mushroom"],
  },
];

export async function getProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return TANITE_DATABASE_MOCK;
}

/**
 * Looks up a single clothing item by its unique ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const product = TANITE_DATABASE_MOCK.find((item) => item.id === id);
  return product || null;
}
