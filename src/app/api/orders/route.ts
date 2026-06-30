import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// POST: Process and record a fresh customer checkout order transaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, total } = body;

    // Validation Guard: Ensure payload contains essential transactional nodes
    if (!customer || !items || items.length === 0 || !total) {
      return NextResponse.json(
        { error: "Malformed checkout payload. Missing customer, items, or total fields." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("tanite_studio");

    // Construct the structured transaction document
    const finalOrder = {
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        street: customer.street,
        city: customer.city,
      },
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        size: item.size,
        color: item.color,
        quantity: parseInt(item.quantity, 10),
      })),
      totalAmount: parseFloat(total),
      fulfillmentStatus: "unfulfilled", // Default pipeline tracking state
      paymentStatus: "paid",            // Assuming successful simulation auth
      createdAt: new Date(),
    };

    // Insert document into database cluster
    const result = await db.collection("orders").insertOne(finalOrder);

    return NextResponse.json(
      { 
        message: "Order data processed and logged successfully.", 
        orderId: result.insertedId 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Order ingestion pipeline error:", error);
    return NextResponse.json(
      { error: "Internal transaction ledger execution crash." },
      { status: 500 }
    );
  }
}

// GET: Retrieve a log profile list of all global store orders (For Admin Dashboard metrics)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("tanite_studio");

    // Fetch orders organized chronologically by newest first
    const orders = await db
      .collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Failed to extract orders stream:", error);
    return NextResponse.json(
      { error: "Database transaction logs extraction failure." },
      { status: 500 }
    );
  }
}