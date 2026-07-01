import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, total } = body;

    if (!customer || !items || items.length === 0 || !total) {
      return NextResponse.json(
        {
          error:
            "Malformed checkout payload. Missing customer, items, or total fields.",
        },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("tanite_studio");

    // --- STEP A: PREPARE BULK WRITE OPERATION OPERANDS ---
    // Maps over items and queues atomic increments/decrements targeting product variants.
    // This looks for a base 'stock' or variant tracking architecture.
    const stockReductionOperations = items.map((item: any) => {
      return {
        updateOne: {
          filter: { _id: new ObjectId(item.id) },
          // Atomically decrements the root stock count by the assigned order line item weight
          update: { $inc: { stock: -parseInt(item.quantity, 10) } },
        },
      };
    });

    // --- STEP B: EXECUTE TRANSACTION BINDING ---
    // We execute the stock decrement inside your product collection immediately.
    if (stockReductionOperations.length > 0) {
      await db
        .collection("products")
        .bulkWrite(stockReductionOperations, { ordered: true });
    }

    // --- STEP C: WRITE ORDER LOG TO ARCHIVE LEDGER ---
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
      fulfillmentStatus: "unfulfilled",
      paymentStatus: "paid",
      createdAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(finalOrder);

    return NextResponse.json(
      {
        message:
          "Order data processed and inventory stock levels stepped down successfully.",
        orderId: result.insertedId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Order ingestion or stock update execution pipeline error:",
      error,
    );
    return NextResponse.json(
      {
        error:
          "Internal transaction ledger execution crash during automated write cycle.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("tanite_studio");

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
      { status: 500 },
    );
  }
}
