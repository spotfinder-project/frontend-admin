import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

// Types for your API responses
interface LoginResponse {
  id: string;
  // accessToken: string;
  // refreshToken: string;
  // accessExpiration: number;
  // refreshExpiration: number;
}

const baseUrl = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export const login = async (
  id: string,
  password: string
): Promise<LoginResponse> => {
  const response = await baseUrl.post<LoginResponse>("/admins/login", {
    id,
    password,
  });

  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    // Optional: Call the external API to handle logout on the backend
    await baseUrl.post("/admin/logout"); // Replace with the appropriate logout endpoint if needed

    // Remove cookies
    // deleteCookie("accessToken");
    // deleteCookie("refreshToken");
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};
