/** Roles that should require MFA once backend verification is available. */
export const MFA_SENSITIVE_ROLES = new Set(["SUPER_ADMIN", "ORG_ADMIN"]);

export function shouldRequireMfa(roles: string[]): boolean {
  return roles.some((role) => MFA_SENSITIVE_ROLES.has(role));
}

/**
 * Placeholder until backend MFA is implemented.
 * When true, sign-in should pause until the user completes a second factor.
 */
export function isMfaVerificationPending(): boolean {
  return false;
}
