export const fetcher = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Request failed");
  }

  return res.json();
};

export const createOptions = (method: string, body?: any): RequestInit => ({
  method,
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer $token`,
  },
  body: body ? JSON.stringify(body) : undefined,
});
