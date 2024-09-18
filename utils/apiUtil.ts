export const fetchData = async (url: string, options: RequestInit = {}) => {
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
  },
  body: body ? JSON.stringify(body) : undefined,
});

export const loginFetcher = (url: string, id: string, password: string) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, password }),
  }).then((res) => res.json());
