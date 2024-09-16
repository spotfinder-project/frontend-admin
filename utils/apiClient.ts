import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { refreshToken, logout } from "@/service/authService";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Replace with your external API's base URL
});

// Request interceptor to add accessToken to headers
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and reissue
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized error
    if (error.response?.status === 401) {
      // Check if it's a token expiration error
      if (error.response.data?.message === "Access token expired") {
        try {
          // Attempt to refresh the token
          const newTokens = await refreshToken();
          const { accessToken } = newTokens;

          // Update the Axios default headers with the new access token
          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;

          // Retry the original request with the new access token
          return apiClient(originalRequest);
        } catch (refreshError) {
          // If refreshing fails, call logout
          await logout();
          return Promise.reject(refreshError);
        }
      }

      // Handle other 401 errors if necessary
    }

    return Promise.reject(error);
  }
);

export default apiClient;
