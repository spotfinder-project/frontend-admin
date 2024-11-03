import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
type Params = {
  startDate?: string;
  endDate?: string;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams;

    const params: Params = {
      startDate: query.get("startDate") || undefined,
      endDate: query.get("endDate") || undefined,
    };

    // Build query string from params
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined) // Filter out undefined values
    ).toString();

    const apiUrl = `${API_BASE_URL}/members/signup/history${
      queryString ? `?${queryString}` : ""
    }`;

    const cookies = request.headers.get("cookie");

    // Make the actual call to the external API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      credentials: "include", // Include cookies
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
