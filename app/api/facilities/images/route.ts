import { NextResponse } from "next/server";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: Request) {
  try {
    const cookies = request.headers.get("cookie");
    const formData = await request.formData();

    // Logging the FormData content for debugging
    const images = formData.getAll("images"); // Replace 'images' with the name used in your form
    console.log("Uploaded Images:", images);

    const fetchRes = await fetch(`${API_BASE_URL}/facilities/images`, {
      method: "POST",
      headers: {
        cookie: cookies || "",
      },
      credentials: "include",
      body: formData,
    });

    const data = await fetchRes.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in facilities/images API route:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
