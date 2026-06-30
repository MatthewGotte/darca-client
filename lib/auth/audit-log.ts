export type AuthAuditEvent =
  | "SIGN_IN_SUCCESS"
  | "SIGN_IN_FAILURE"
  | "SIGN_IN_RATE_LIMITED"
  | "SIGN_OUT"
  | "TOKEN_REFRESH_SUCCESS"
  | "TOKEN_REFRESH_FAILURE"
  | "PASSWORD_RESET_REQUESTED"
  | "PASSWORD_RESET_COMPLETED";

export type AuthAuditDetails = {
  userId?: string;
  email?: string;
  reason?: string;
  ip?: string;
};

export function logAuthAuditEvent(
  event: AuthAuditEvent,
  details: AuthAuditDetails = {}
): void {
  const payload = {
    type: "auth_audit",
    event,
    timestamp: new Date().toISOString(),
    ...details,
  };

  if (process.env.NODE_ENV === "production") {
    console.info(JSON.stringify(payload));
  } else {
    console.info("[auth-audit]", payload);
  }
}
