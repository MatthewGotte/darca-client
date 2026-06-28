"use client";

import { useCallback, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { logout } from "@/lib/api/api";

export function useAuth() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      void signOut({ callbackUrl: "/login" });
    }
  }, [session?.error]);

  const handleSignOut = useCallback(async () => {
    if (session?.refreshToken) {
      try {
        await logout(session.refreshToken);
      } catch {
        // Still clear the client session if revocation fails
      }
    }
    await signOut({ callbackUrl: "/login" });
  }, [session]);

  return {
    user: session?.user ?? null,
    roles: session?.roles ?? [],
    permissions: session?.permissions ?? [],
    accessToken: session?.accessToken,
    refreshToken: session?.refreshToken,
    isAuthenticated: status === "authenticated" && !session?.error,
    isLoading: status === "loading",
    signOut: handleSignOut,
  };
}
