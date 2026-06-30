import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { logAuthAuditEvent } from "@/lib/auth/audit-log";
import {
  fetchCurrentUser,
  loginWithCredentials,
  refreshAccessToken,
} from "@/lib/auth/server-api";
import {
  checkLoginRateLimit,
  recordLoginFailure,
  recordLoginSuccess,
} from "@/lib/auth/login-rate-limit";
import { shouldRequireMfa } from "@/lib/auth/mfa";
import { getSafeCallbackUrl } from "@/lib/auth/safe-redirect";
import {
  authCookieConfig,
  authSessionConfig,
} from "@/lib/auth/session-config";
import {
  createRefreshFailedToken,
  isTokenExpired,
} from "@/lib/auth/token-session";
import type { AuthJwt, AuthUser } from "@/lib/auth/types";

class RateLimitExceededError extends CredentialsSignin {
  code = "rate_limit_exceeded";

  constructor(retryAfterSeconds?: number) {
    super();
    this.message = retryAfterSeconds
      ? `Too many login attempts. Try again in ${retryAfterSeconds} seconds.`
      : "Too many login attempts. Please try again later.";
  }
}

async function rotateAccessToken(token: AuthJwt): Promise<AuthJwt> {
  if (!token.refreshToken) {
    throw new Error("Missing refresh token");
  }

  const auth = await refreshAccessToken(token.refreshToken);
  const me = await fetchCurrentUser(auth.accessToken);

  return {
    ...token,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    accessTokenExpires: Date.now() + auth.expiresIn * 1000,
    id: me.id,
    organisationId: me.organisationId,
    name: me.name,
    email: me.email,
    roles: me.roles,
    permissions: me.permissions,
    error: undefined,
  };
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    roles?: string[];
    permissions?: string[];
    error?: string;
    user: {
      id: string;
      organisationId: string;
      name?: string | null;
      email?: string | null;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          return null;
        }

        const rateCheck = checkLoginRateLimit(email);
        if (!rateCheck.allowed) {
          logAuthAuditEvent("SIGN_IN_RATE_LIMITED", { email });
          throw new RateLimitExceededError(rateCheck.retryAfterSeconds);
        }

        try {
          const authResponse = await loginWithCredentials(email, password);
          const me = await fetchCurrentUser(authResponse.accessToken);

          recordLoginSuccess(email);

          if (shouldRequireMfa(me.roles)) {
            logAuthAuditEvent("SIGN_IN_SUCCESS", {
              email,
              userId: me.id,
              reason: "mfa_eligible_user",
            });
          } else {
            logAuthAuditEvent("SIGN_IN_SUCCESS", { email, userId: me.id });
          }

          const user: AuthUser = {
            id: me.id,
            organisationId: me.organisationId,
            name: me.name,
            email: me.email,
            accessToken: authResponse.accessToken,
            refreshToken: authResponse.refreshToken,
            accessTokenExpires: Date.now() + authResponse.expiresIn * 1000,
            roles: me.roles,
            permissions: me.permissions,
          };

          return user;
        } catch (error) {
          recordLoginFailure(email);
          logAuthAuditEvent("SIGN_IN_FAILURE", {
            email,
            reason: error instanceof Error ? error.message : "unknown",
          });
          return null;
        }
      },
    }),
  ],
  session: authSessionConfig,
  cookies: authCookieConfig,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    redirect({ url, baseUrl }) {
      const safePath = getSafeCallbackUrl(url, baseUrl);
      return new URL(safePath, baseUrl).toString();
    },
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user && !session.error;
      const { pathname } = nextUrl;

      if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password")
      ) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      return isLoggedIn;
    },
    jwt: async ({ token, user }) => {
      const authToken = token as AuthJwt;

      if (user) {
        const authUser = user as AuthUser;
        return {
          ...authToken,
          id: authUser.id,
          organisationId: authUser.organisationId,
          name: authUser.name,
          email: authUser.email,
          accessToken: authUser.accessToken,
          refreshToken: authUser.refreshToken,
          accessTokenExpires: authUser.accessTokenExpires,
          roles: authUser.roles,
          permissions: authUser.permissions,
        } satisfies AuthJwt;
      }

      if (authToken.error === "RefreshAccessTokenError") {
        return createRefreshFailedToken(authToken);
      }

      if (!isTokenExpired(authToken.accessTokenExpires)) {
        return authToken;
      }

      try {
        const refreshed = await rotateAccessToken(authToken);
        logAuthAuditEvent("TOKEN_REFRESH_SUCCESS", {
          userId: authToken.id,
          email: authToken.email,
        });
        return refreshed;
      } catch (error) {
        logAuthAuditEvent("TOKEN_REFRESH_FAILURE", {
          userId: authToken.id,
          email: authToken.email,
          reason: error instanceof Error ? error.message : "unknown",
        });
        return createRefreshFailedToken(authToken);
      }
    },
    session: async ({ session, token }) => {
      const authToken = token as AuthJwt;

      if (authToken.error === "RefreshAccessTokenError") {
        session.error = authToken.error;
        session.accessToken = undefined;
        session.refreshToken = undefined;
        session.accessTokenExpires = undefined;
        session.roles = [];
        session.permissions = [];
        return session;
      }

      Object.assign(session.user, {
        id: authToken.id ?? "",
        organisationId: authToken.organisationId ?? "",
        name: authToken.name ?? "",
        email: authToken.email ?? "",
      });
      session.accessToken = authToken.accessToken;
      session.refreshToken = authToken.refreshToken;
      session.accessTokenExpires = authToken.accessTokenExpires;
      session.roles = authToken.roles ?? [];
      session.permissions = authToken.permissions ?? [];
      session.error = authToken.error;
      return session;
    },
  },
  events: {
    signOut(message) {
      const token = "token" in message ? (message.token as AuthJwt) : undefined;
      logAuthAuditEvent("SIGN_OUT", {
        userId: token?.id,
        email: token?.email,
      });
    },
  },
});
