import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  fetchCurrentUser,
  loginWithCredentials,
  refreshAccessToken,
} from "@/lib/auth/server-api";

type AuthUser = {
  id: string;
  organisationId: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  roles: string[];
  permissions: string[];
};

type AuthJwt = {
  id?: string;
  organisationId?: string;
  name?: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  roles?: string[];
  permissions?: string[];
  error?: string;
};

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

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const authResponse = await loginWithCredentials(
          credentials.email as string,
          credentials.password as string
        );
        const me = await fetchCurrentUser(authResponse.accessToken);

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
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
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

      const accessTokenExpires = authToken.accessTokenExpires ?? 0;

      if (Date.now() < accessTokenExpires - 60_000) {
        return authToken;
      }

      try {
        return await rotateAccessToken(authToken);
      } catch {
        return { ...authToken, error: "RefreshAccessTokenError" };
      }
    },
    session: async ({ session, token }) => {
      const authToken = token as AuthJwt;

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
});
