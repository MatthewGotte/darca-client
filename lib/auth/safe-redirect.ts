const DEFAULT_REDIRECT = "/";

const BLOCKED_PREFIXES = ["/login", "/forgot-password", "/reset-password"];

/**
 * Returns a same-origin relative path safe for post-auth redirects.
 * Rejects absolute URLs, protocol-relative paths, and auth-page loops.
 */
export function getSafeCallbackUrl(
  callbackUrl: string | null | undefined,
  baseUrl?: string
): string {
  if (!callbackUrl || typeof callbackUrl !== "string") {
    return DEFAULT_REDIRECT;
  }

  const trimmed = callbackUrl.trim();
  if (!trimmed) {
    return DEFAULT_REDIRECT;
  }

  if (baseUrl && /^https?:\/\//.test(trimmed)) {
    try {
      const resolved = new URL(trimmed);
      const base = new URL(baseUrl);
      if (resolved.origin !== base.origin) {
        return DEFAULT_REDIRECT;
      }
      return getSafeCallbackUrl(
        `${resolved.pathname}${resolved.search}`,
        baseUrl
      );
    } catch {
      return DEFAULT_REDIRECT;
    }
  }

  if (
    trimmed.startsWith("//") ||
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) ||
    trimmed.includes("\\")
  ) {
    return DEFAULT_REDIRECT;
  }

  if (!trimmed.startsWith("/")) {
    return DEFAULT_REDIRECT;
  }

  if (BLOCKED_PREFIXES.some((path) => isAuthPath(trimmed, path))) {
    return DEFAULT_REDIRECT;
  }

  if (baseUrl) {
    try {
      const resolved = new URL(trimmed, baseUrl);
      const base = new URL(baseUrl);
      if (resolved.origin !== base.origin) {
        return DEFAULT_REDIRECT;
      }
    } catch {
      return DEFAULT_REDIRECT;
    }
  }

  return trimmed;
}

function isAuthPath(url: string, path: string): boolean {
  return url === path || url.startsWith(`${path}?`) || url.startsWith(`${path}/`);
}
