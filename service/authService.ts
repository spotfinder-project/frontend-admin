import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

// Types for your API responses
interface LoginResponse {
  id: string;
  accessToken: string;
  refreshToken: string;
  accessExpiration: number;
  refreshExpiration: number;
}

const baseUrl = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export const login = async (
  id: string,
  password: string
): Promise<LoginResponse> => {
  const response = await baseUrl.post<LoginResponse>("/admin/login", {
    id,
    password,
  });

  // const { accessToken, refreshToken, accessExpiration, refreshExpiration } =
  //   response.data;

  // // Save tokens in cookies
  // setCookie("userId", id, {
  //   maxAge: accessExpiration,
  // });
  // setCookie("accessToken", accessToken, {
  //   maxAge: accessExpiration,
  // });
  // setCookie("refreshToken", refreshToken, {
  //   maxAge: refreshExpiration,
  // });

  return response.data;
};

export const refreshToken = async (): Promise<LoginResponse> => {
  const userId = getCookie("userId"); // You would need to retrieve it from cookies

  const response = await baseUrl.post<LoginResponse>("/admin/reissue", {
    id: userId,
  });

  const { accessToken, accessExpiration } = response.data;

  // Update tokens in cookies
  setCookie("accessToken", accessToken, {
    maxAge: accessExpiration,
  });
  // setCookie("refreshToken", newRefreshToken, {
  //   maxAge: parseInt(refreshTokenExpiration),
  // });

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
