import { NextResponse } from "next/server";
import { ReviewParams } from "@/types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams;

    const params: ReviewParams = {
      nickname: query.get("nickname") || undefined,
      facilityName: query.get("facilityName") || undefined,
      content: query.get("content") || undefined,
      startDate: query.get("startDate") || undefined,
      endDate: query.get("endDate") || undefined,
      page: query.get("page") || undefined,
      size: query.get("size") || undefined,
    };

    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    ).toString();

    const apiUrl = `${API_BASE_URL}/reviews${
      queryString ? `?${queryString}` : ""
    }`;

    const cookies = request.headers.get("cookie");
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { reviewIds } = body;

    // Validate reviewIds
    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return NextResponse.json(
        { error: "No reviewIds provided" },
        { status: 400 }
      );
    }

    // Convert reviewIds array to query string
    const reviewIdsQuery = reviewIds
      .map((id: number) => `reviewIds=${id}`)
      .join("&");
    const apiUrl = `${API_BASE_URL}/reviews${
      reviewIdsQuery ? `?${reviewIdsQuery}` : ""
    }`;

    const cookies = request.headers.get("cookie");

    // Make DELETE request to the external API
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      credentials: "include", // Include cookies
    });

    if (!response.ok) {
      const errorResponse = await response.json(); // Log the error response
      console.error("Fetch error response:", errorResponse);
      return NextResponse.json(
        { error: "Failed to delete reviews" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
