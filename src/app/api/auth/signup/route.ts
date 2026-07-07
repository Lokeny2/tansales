import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "This endpoint is deprecated and was never functional. Use Convex (api.auth.signUp) for account creation.",
    },
    { status: 410 },
  );
}
