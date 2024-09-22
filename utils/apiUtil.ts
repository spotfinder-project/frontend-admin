export const createOptions = (method: string, body?: any): RequestInit => ({
  method,
  headers: {
    "Content-Type": "application/json",
  },
  body: body ? JSON.stringify(body) : undefined,
});

export const loginFetcher = async (id: string, password: string) => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
      // credentials: "include", // Ensure cookies are included in the request
    });

    const loginResponse = await response.json();

    if (!loginResponse?.data)
      throw new Error(loginResponse.code ?? loginResponse.error);

    return loginResponse;
  } catch (error) {
    console.log("Error in loginFetcher:", error);
  }
};
