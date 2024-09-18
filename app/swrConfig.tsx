"use client";

import { SWRConfig } from "swr";
import { fetchData } from "@/utils/apiUtil";

export default function GlobalSWRConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string, options?: RequestInit) =>
          fetchData(url, options),
        revalidateOnFocus: false, // Disable revalidation on focus globally
        shouldRetryOnError: false, // Disable retry on error globally
      }}
    >
      {children}
    </SWRConfig>
  );
}
