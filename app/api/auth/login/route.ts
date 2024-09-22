// /app/api/auth/route.ts
import { NextResponse } from "next/server";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: Request) {
  try {
    const { id, password } = await request.json();

    if (!id || !password) {
      return NextResponse.json(
        { error: "Missing id or password" },
        { status: 400 }
      );
    }

    // Make the actual call to the external API
    const response = await fetch(`${API_BASE_URL}/admins/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
      credentials: "include",
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: error.status }
    );
  }
}
