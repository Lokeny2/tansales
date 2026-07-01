import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH: Update specific fields of an existing product SKU
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verify valid MongoDB ObjectId format before connecting to DB
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product identifier format." },
        { status: 400 },
      );
    }

    // Build the update payload dynamically based on passed fields
    const updateData: Record<string, any> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tag !== undefined) updateData.tag = body.tag;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.sizes !== undefined)
      updateData.sizes = Array.isArray(body.sizes) ? body.sizes : [];
    if (body.colors !== undefined)
      updateData.colors = Array.isArray(body.colors) ? body.colors : [];

    updateData.updatedAt = new Date();

    const client = await clientPromise;
    const db = client.db("tanite_studio");

    const result = await db
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Target SKU document not found inside active collections." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "SKU mutations committed successfully to cluster." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Database mutation failure:", error);
    return NextResponse.json(
      {
        error:
          "Internal execution pipeline exception during field modification.",
      },
      { status: 500 },
    );
  }
}

// DELETE: Permanently purge an item from the catalog collection
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product identifier format." },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("tanite_studio");

    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Target SKU document not found inside active collections." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "SKU purged successfully from storage matrix." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Database record deletion failure:", error);
    return NextResponse.json(
      { error: "Internal execution pipeline exception during record purge." },
      { status: 500 },
    );
  }
}
