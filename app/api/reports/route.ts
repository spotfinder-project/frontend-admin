import { ReportParams } from "@/types/types";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams;

    const params: ReportParams = {
      content: query.get("content") || undefined,
      status: query.get("status") || undefined,
      startDate: query.get("startDate") || undefined,
      endDate: query.get("endDate") || undefined,
      memberId: query.get("memberId") || undefined,
      facilityId: query.get("facilityId") || undefined,
      page: query.get("page") || undefined,
      size: query.get("size") || undefined,
    };

    // Build query string from params
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined) // Filter out undefined values
    ).toString();

    const apiUrl = `${API_BASE_URL}/reports${
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

export async function PUT(request: Request, response: Response) {
  try {
    const cookies = request.headers.get("cookie");
    const { reportId, status, answer } = await request.json();
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      credentials: "include",
      body: JSON.stringify({
        reportId,
        status,
        answer,
      }),
    });

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
