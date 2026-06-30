const isProduction = process.env.NODE_ENV === "production";

export const authSessionConfig = {
  strategy: "jwt" as const,
  maxAge: 8 * 60 * 60,
  updateAge: 60 * 60,
};

export const authCookieConfig = {
  sessionToken: {
    name: isProduction
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: isProduction,
    },
  },
  callbackUrl: {
    name: isProduction
      ? "__Secure-authjs.callback-url"
      : "authjs.callback-url",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: isProduction,
    },
  },
  csrfToken: {
    name: isProduction ? "__Host-authjs.csrf-token" : "authjs.csrf-token",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: isProduction,
    },
  },
};
