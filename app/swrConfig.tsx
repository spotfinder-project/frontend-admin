"use client";

import { SWRConfig } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GlobalSWRConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false, // Disable revalidation on focus globally
        shouldRetryOnError: false, // Disable retry on error globally
      }}
    >
      {children}
    </SWRConfig>
  );
}
