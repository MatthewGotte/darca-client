"use client";

import { SWRConfig } from "swr";

export default function SwrProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}
