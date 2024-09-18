// import apiClient from "@/utils/apiClient";
"use server";
import axios from "axios";

const baseUrl = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

type UserSlugProps = {
  slug: string;
};

export async function getUserBySlug({ slug }: UserSlugProps) {
  console.log(slug);
}

// Type for query parameters
export interface userParams {
  memberSeq?: number;
  name?: string;
  nickname?: string;
  birthday?: string;
  gender?: string;
  socialType?: string;
  startDate?: string;
  endDate?: string;
}

export const getUsers = async (params: userParams) => {
  try {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();

    // Make GET request with query parameters
    const response = await baseUrl.get(`/members?${queryString}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
