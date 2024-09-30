"use client";

import { SWRConfig } from "swr";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false, // Disable revalidation on focus globally
        shouldRetryOnError: false,
        onError: (error) => {
          if (error.status === 401) {
            router.push("/");
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
