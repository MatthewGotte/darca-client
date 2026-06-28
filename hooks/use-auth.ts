"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      void signOut({ callbackUrl: "/login" });
    }
  }, [session?.error]);

  return {
    user: session?.user ?? null,
    roles: session?.roles ?? [],
    permissions: session?.permissions ?? [],
    accessToken: session?.accessToken,
    isAuthenticated: status === "authenticated" && !session?.error,
    isLoading: status === "loading",
    signOut: () => signOut({ callbackUrl: "/login" }),
  };
}
