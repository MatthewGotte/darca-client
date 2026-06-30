/**
 * Layer-1 route guard (Next.js 16 "proxy"; formerly middleware).
 * Enforces the `authorized` callback in auth.ts before dashboard routes render.
 */
export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    "/((?!login|forgot-password|reset-password|api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
