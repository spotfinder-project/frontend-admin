import { NextResponse } from "next/server";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: Request) {
  try {
    const cookies = request.headers.get("cookie");
    const formaData = await request.formData();
    console.log(formaData);

    const fetchRes = await fetch(`${API_BASE_URL}/facilities/images`, {
      method: "POST",
      headers: {
        cookie: cookies || "",
      },
      credentials: "include",
      body: formaData.get("image"),
    });

    const data = await fetchRes.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
