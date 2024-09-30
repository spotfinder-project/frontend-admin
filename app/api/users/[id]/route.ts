import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET request handler (Fetch user by id)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  console.log(id);

  try {
    // Fetch the user from the external API or your database
    const cookies = request.headers.get("cookie");
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch user with memberId: ${id}` },
        { status: response.status }
      );
    }

    const user = await response.json();
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE request handler (Delete user by id)
export async function DELETE(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  const { memberId } = params;

  try {
    const cookies = request.headers.get("cookie");
    // Send a request to delete the user
    const response = await fetch(`${API_BASE_URL}/members/${memberId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to delete user with memberId: ${memberId}` },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: `User with memberId: ${memberId} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
