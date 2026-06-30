import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface ContextProps {
  params: Promise<{ id: string }>;
}

// PUT: Update an existing product document by its unique hex identifier
export async function PUT(request: Request, { params }: ContextProps) {
  try {
    const { id } = await params;
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db("tanite_studio");

    // Format fields to ensure numeric data updates correctly
    const updateData: any = { ...body };
    if (body.price) updateData.price = parseFloat(body.price);

    const result = await db
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Target document not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "SKU profile record updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid hexadecimal ID structure string signature." },
      { status: 400 },
    );
  }
}

// DELETE: Terminate an item resource from inventory permanently
export async function DELETE(request: Request, { params }: ContextProps) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("tanite_studio");

    const result = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Target document not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "SKU record purged from cluster collection layers." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid database identification token." },
      { status: 400 },
    );
  }
}
