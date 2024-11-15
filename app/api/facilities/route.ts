import { NextResponse } from "next/server";
import { FacilityParams } from "@/types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams;

    const params: FacilityParams = {
      facilityId: query.get("facilityId") || undefined,
      name: query.get("name") || undefined,
      type: (query.get("type") as "R" | "S" | "T") || undefined,
      location: query.get("location") || undefined,
      approvalStatus:
        (query.get("approvalStatus") as "P" | "A" | "R" | "S") || undefined,
      startDate: query.get("startDate") || undefined,
      endDate: query.get("endDate") || undefined,
      page: query.get("page") || undefined,
      size: query.get("size") || undefined,
    };

    // Build query string from params
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined) // Filter out undefined values
    ).toString();

    const apiUrl = `${API_BASE_URL}/facilities${
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
    const {
      facilityId,
      type,
      name,
      location,
      detailLocation,
      latitude,
      longitude,
      information,
      department,
      departmentPhoneNumber,
      approvalStatus,
      imageIds,
    } = await request.json();
    const response = await fetch(`${API_BASE_URL}/facilities`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      credentials: "include",
      body: JSON.stringify({
        facilityId,
        type,
        name,
        location,
        detailLocation,
        latitude,
        longitude,
        information,
        department,
        departmentPhoneNumber,
        approvalStatus,
        imageIds,
      }),
    });

    const data = await response.json();
    console.log(data);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, response: Response) {
  try {
    const cookies = request.headers.get("cookie");
    const {
      type,
      name,
      location,
      detailLocation,
      latitude,
      longitude,
      information,
      department,
      departmentPhoneNumber,
      approvalStatus,
      imageIds,
    } = await request.json();

    const response = await fetch(`${API_BASE_URL}/facilities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      credentials: "include",
      body: JSON.stringify({
        type,
        name,
        location,
        detailLocation,
        latitude,
        longitude,
        information,
        department,
        departmentPhoneNumber,
        approvalStatus,
        imageIds,
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

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { facilityIds } = body;

    // Validate facilityIds
    if (!Array.isArray(facilityIds) || facilityIds.length === 0) {
      return NextResponse.json(
        { error: "No facilityIds provided" },
        { status: 400 }
      );
    }

    const facilityIdsQuery = facilityIds
      .map((id: number) => `facilityIds=${id}`)
      .join("&");
    const apiUrl = `${API_BASE_URL}/facilities${
      facilityIdsQuery ? `?${facilityIdsQuery}` : ""
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
