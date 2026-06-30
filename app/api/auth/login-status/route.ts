import { getLoginAttemptStatus } from "@/lib/auth/login-rate-limit";

export async function POST(request: Request) {
  let email: string | undefined;

  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email : undefined;
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!email?.trim()) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  return Response.json(getLoginAttemptStatus(email));
}
