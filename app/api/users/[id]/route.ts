import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET request handler (Fetch user by id)
export async function GET(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  const { memberId } = params;

  try {
    // Fetch the user from the external API or your database
    const response = await fetch(`${API_BASE_URL}/memers/${memberId}`, {
      method: "GET",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch user with memberId: ${memberId}` },
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
    // Send a request to delete the user
    const response = await fetch(`${API_BASE_URL}/users/${memberId}`, {
      method: "DELETE",
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
