"use client";

import { SessionProvider } from "next-auth/react";
import SwrProvider from "@/components/swr-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SwrProvider>{children}</SwrProvider>
    </SessionProvider>
  );
}
