export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  tag: string;
  imageUrl: string; // Added field for asset pipeline
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
  },
  {
    id: "2",
    name: "Signature Oversized Hoodie",
    price: "$65.0",
    category: "Hoodies",
    tag: "PRE-ORDER",
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Modular Canvas Jacket",
    price: "$110.0",
    category: "Outerwear",
    tag: "LIMITED",
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
  },
];

export async function getProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return TANITE_DATABASE_MOCK;
}
