// app/api/notices/route.ts
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Ensure this is set correctly in your .env file

export async function GET(request: Request) {
  try {
    // Make the actual call to the external API
    const response = await fetch(`${API_BASE_URL}/notices`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensure cookies are sent with the request
    });

    // Check if the response is ok
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch notices" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching notices:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
