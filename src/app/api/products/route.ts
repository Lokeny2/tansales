import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: Fetch all clothing items from the database catalog
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("tanite_studio");

    // Query all documents from the products collection and convert to array
    const products = await db.collection("products").find({}).toArray();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Database connection failure:", error);
    return NextResponse.json(
      { error: "Failed to retrieve catalog data from storage pipeline." },
      { status: 500 },
    );
  }
}

// POST: Add a completely new product item (Admin Pipeline)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Simple verification guard to ensure required data exists
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: "Missing critical product payload variables." },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("tanite_studio");

    // Clean data formatting before inserting
    const newProduct = {
      name: body.name,
      price: parseFloat(body.price),
      category: body.category,
      tag: body.tag || "NEW",
      imageUrl: body.imageUrl,
      description: body.description,
      sizes: body.sizes || [],
      colors: body.colors || [],
      createdAt: new Date(),
    };

    const result = await db.collection("products").insertOne(newProduct);

    return NextResponse.json(
      { message: "SKU record logged successfully", id: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Database write failure:", error);
    return NextResponse.json(
      { error: "Internal execution pipeline exception error." },
      { status: 500 },
    );
  }
}
