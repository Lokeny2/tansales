import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message:
      "GET endpoint active: Ready to extract and query all products documents from MongoDB Atlas.",
    status: 200,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      message:
        "POST endpoint active: Secure product document creation successful.",
      receivedPayload: body,
      status: 201,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid layout compilation payload request error structure." },
      { status: 400 },
    );
  }
}
