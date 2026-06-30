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
    name: "Heavyweight Boxy Tee",
    price: "$30.0",
    category: "Tees",
    tag: "NEW",
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
    description:
      "Cut from 280GSM ultra-soft combed cotton. Features a relaxed boxy silhouette, dropped shoulders, and a thick ribbed collar that holds its shape over time.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Off-White", "Slate"],
  },
  {
    id: "2",
    name: "Signature Oversized Hoodie",
    price: "$65.0",
    category: "Hoodies",
    tag: "PRE-ORDER",
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
    description:
      "Constructed with heavy loopback French terry cloth. Oversized drape with no drawcolds for a clean, structural aesthetic. Double-lined hood.",
    sizes: ["M", "L", "XL"],
    colors: ["Obsidian", "Charcoal"],
  },
  {
    id: "3",
    name: "Modular Canvas Jacket",
    price: "$110.0",
    category: "Outerwear",
    tag: "LIMITED",
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
    description:
      "Weatherproof 12oz duck canvas structural outer shell. Features modular hidden zip pockets, industrial steel enclosures, and full interior satin lining.",
    sizes: ["S", "M", "L"],
    colors: ["Sand", "Olive", "Black"],
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
