// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: Request) {
  try {
    // Make the call to the external API for logout
    const cookies = request.headers.get("cookie");
    const response = await fetch(`${API_BASE_URL}/admins/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to logout" },
        { status: response.status }
      );
    }

    const data = await response.json();

    const logoutResponse = NextResponse.json(data);
    logoutResponse.cookies.delete("accessToken");
    logoutResponse.cookies.delete("refreshToken");

    return logoutResponse;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
