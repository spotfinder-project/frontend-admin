"use client";

import { SWRConfig } from "swr";

interface ErrorResponse {
  status: "error";
  code: number;
  errorMessage: string;
}
type Props = {
  children: React.ReactNode;
};

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    const { status, statusText } = res;

    const error: ErrorResponse = {
      status: "error",
      code: status,
      errorMessage: statusText,
    };

    throw error;
  }

  const { code, data } = await res.json();
  return code === 204 ? undefined : data;
};

export default function SWRConfigContext({ children }: Props) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false, // Disable revalidation on focus globally
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
