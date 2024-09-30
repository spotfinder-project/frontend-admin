import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

// Types for your API responses
interface LoginResponse {
  code: string;
  data: object;
  message: string;
}

const baseUrl = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export const login = async (
  id: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, password }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Login failed");
  }

  const data = await response.json();
  return data;
};

export const logout = async () => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "logout failed");
  }

  // const data = await response.json();
  // console.log(data);
  // return data;

  return response;
};

interface UpdateResponse {
  code: string;
  message: string;
}

export const updatePassword = async (
  password: string
): Promise<UpdateResponse> => {
  const response = await fetch("/api/auth/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "logout failed");
  }

  const data = await response.json();
  return data;
};
