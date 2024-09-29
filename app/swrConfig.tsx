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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
