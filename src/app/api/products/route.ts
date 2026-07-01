import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use Convex for product data." },
    { status: 410 },
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use Convex for product mutations." },
    { status: 410 },
  );
}
