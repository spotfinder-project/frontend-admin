// app/api/users/route.ts
import { NextResponse } from "next/server";

interface UserParams {
  memberSeq?: number;
  name?: string;
  nickname?: string;
  birthday?: string;
  gender?: string;
  socialType?: string;
  startDate?: string;
  endDate?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams;

    const params: UserParams = {
      memberSeq: query.has("memberSeq")
        ? Number(query.get("memberSeq"))
        : undefined,
      name: query.get("name") || undefined,
      nickname: query.get("nickname") || undefined,
      birthday: query.get("birthday") || undefined,
      gender: query.get("gender") || undefined,
      socialType: query.get("socialType") || undefined,
      startDate: query.get("startDate") || undefined,
      endDate: query.get("endDate") || undefined,
    };

    // // Build query string from params
    // const queryString = new URLSearchParams(
    //   params as Record<string, string>
    // ).toString();

    // // Make the actual call to the external API
    // const response = await fetch(`${API_BASE_URL}/users?${queryString}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   credentials: "include",
    // });

    // if (!response.ok) {
    //   return NextResponse.json(
    //     { error: "Failed to fetch users" },
    //     { status: response.status }
    //   );
    // }

    // const data = await response.json();
    // return NextResponse.json(data);

    const mockUsers = [
      {
        memberId: 1,
        name: "김회원",
        nickname: "Kim",
        birthday: "1990-01-01",
        gender: "M",
        socialType: "K",
        createdDate: "2024-09-01",
      },
      {
        memberId: 2,
        name: "김회원",
        nickname: "Kim",
        birthday: "1990-01-01",
        gender: "M",
        socialType: "K",
        createdDate: "2024-09-01",
      },
    ];

    const filtered = mockUsers.map((user) => {
      return {
        ...user,
        id: user.memberId,
      };
    });
    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
