import { NextResponse } from "next/server";

interface ContextProps {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: ContextProps) {
  const { id } = await params;
  const body = await request.json();
  return NextResponse.json({
    message: `PUT endpoint active: Ready to search and update database record with ID parameters: ${id}`,
    receivedPayload: body,
    status: 200,
  });
}

export async function DELETE(request: Request, { params }: ContextProps) {
  const { id } = await params;
  return NextResponse.json({
    message: `DELETE endpoint active: Confirmed instruction to terminate product document instance row matching ID: ${id}`,
    status: 200,
  });
}
