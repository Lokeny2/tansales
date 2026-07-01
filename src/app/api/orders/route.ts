import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use Convex for order submission." },
    { status: 410 },
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use Convex for order history." },
    { status: 410 },
  );
}
