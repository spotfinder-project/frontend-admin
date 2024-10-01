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

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include", // 필요에 따라 쿠키 포함
  });

  if (!res.ok) {
    const errorData: ErrorResponse = await res.json();
    const error = new Error("An error occurred while fetching the data.");
    (error as any).status = res.status; // 상태 코드를 추가
    (error as any).info = errorData; // 에러 정보를 추가

    throw error; // 에러를 던져 SWR에서 처리하게 함
  }

  return res.json();
};

export default function SWRConfigContext({ children }: Props) {
  const router = useRouter();

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
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
