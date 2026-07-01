import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: Request, _context: RouteParams) {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use Convex for product mutations." },
    { status: 410 },
  );
}

export async function DELETE(_request: Request, _context: RouteParams) {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use Convex for product mutations." },
    { status: 410 },
  );
}
