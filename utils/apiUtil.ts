export const createOptions = (method: string, body?: any): RequestInit => ({
  method,
  headers: {
    "Content-Type": "application/json",
  },
  body: body ? JSON.stringify(body) : undefined,
});

export const loginFetcher = async (
  url: string,
  id: string,
  password: string
) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
    });

    const loginResponse = await response.json();

    if (!loginResponse?.data)
      throw Error(loginResponse.code ?? loginResponse.error);

    return loginResponse;
  } catch (error) {
    console.log(error);
  }
};
