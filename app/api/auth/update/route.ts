import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function PUT(request: Request, response: Response) {
  try {
    const cookies = request.headers.get("cookie");
    const { password } = await request.json();
    const response = await fetch(`${API_BASE_URL}/admins`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      credentials: "include",
      body: JSON.stringify({
        password,
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
