import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "GET orders endpoint active: Ready to stream transaction order books logs to dashboard interfaces.",
    status: 200
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    message: "POST orders endpoint active: Pipeline initialized. Ready to process transaction checkouts and log order state documents.",
    receivedPayload: body,
    status: 201
  });
}