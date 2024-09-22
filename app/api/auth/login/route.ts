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

    const clearCookieResponse = NextResponse.json({
      message: "Clearing cookies",
    });
    clearCookieResponse.cookies.delete("accessToken");
    clearCookieResponse.cookies.delete("refreshToken");

    // Make the actual call to the external API
    const response = await fetch(`${API_BASE_URL}/admins/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
    });

    // Capture cookies from the external API response
    const setCookieHeader = response.headers.get("set-cookie");

    // Prepare the response to return to the client
    const data = await response.json();

    // Create a new response object
    const res = NextResponse.json(data);

    // If there are cookies, set them in the response
    if (setCookieHeader) {
      res.headers.set("Set-Cookie", setCookieHeader);
    }

    return res;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
