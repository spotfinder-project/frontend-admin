import apiClient from "@/utils/apiClient";

type UserSlugProps = {
  slug: string;
};

export async function getUserBySlug({ slug }: UserSlugProps) {
  console.log(slug);
}

// Type for query parameters
interface GetUsersParams {
  memberSeq?: number;
  name?: string;
  nickname?: string;
  birthday?: string;
  gender?: string;
  socialType?: string;
  startDate?: string;
  endDate?: string;
}

export const getUsers = async (params: GetUsersParams) => {
  try {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();

    // Make GET request with query parameters
    const response = await apiClient.get(`/members?${queryString}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
