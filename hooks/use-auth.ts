"use client";

import { useCallback, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { logout } from "@/lib/api/api";
import { getSafeCallbackUrl } from "@/lib/auth/safe-redirect";

export function useAuth() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      void signOut({ callbackUrl: getSafeCallbackUrl("/login") });
    }
  }, [session?.error]);

  const handleSignOut = useCallback(async () => {
    const refreshToken = session?.refreshToken;

    if (refreshToken) {
      try {
        await logout(refreshToken);
      } catch {
        // Still clear the client session if revocation fails
      }
    }

    await signOut({ callbackUrl: getSafeCallbackUrl("/login") });
  }, [session?.refreshToken]);

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
