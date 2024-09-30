import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookies = request.headers.get("cookie");
    const id = params.id;

    const response = await fetch(`${API_BASE_URL}/facilities/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      credentials: "include",
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
