type AttemptRecord = {
  failures: number;
  firstFailureAt: number;
  lockedUntil: number;
};

export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_LOCKOUT_MINUTES = 15;
const WINDOW_MS = LOGIN_LOCKOUT_MINUTES * 60 * 1000;
const LOCKOUT_MS = LOGIN_LOCKOUT_MINUTES * 60 * 1000;

const attemptsByEmail = new Map<string, AttemptRecord>();

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export type LoginAttemptStatus = {
  locked: boolean;
  failures: number;
  attemptsRemaining: number;
  retryAfterSeconds?: number;
};

export function getLoginAttemptStatus(email: string): LoginAttemptStatus {
  const key = normalizeEmail(email);
  const record = attemptsByEmail.get(key);
  const now = Date.now();

  if (!record || now - record.firstFailureAt > WINDOW_MS) {
    return {
      locked: false,
      failures: 0,
      attemptsRemaining: LOGIN_MAX_ATTEMPTS,
    };
  }

  if (record.lockedUntil > now) {
    return {
      locked: true,
      failures: record.failures,
      attemptsRemaining: 0,
      retryAfterSeconds: Math.ceil((record.lockedUntil - now) / 1000),
    };
  }

  return {
    locked: false,
    failures: record.failures,
    attemptsRemaining: Math.max(LOGIN_MAX_ATTEMPTS - record.failures, 0),
  };
}

export function checkLoginRateLimit(email: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const status = getLoginAttemptStatus(email);

  if (status.locked) {
    return {
      allowed: false,
      retryAfterSeconds: status.retryAfterSeconds,
    };
  }

  return { allowed: true };
}

export function recordLoginFailure(email: string): void {
  const key = normalizeEmail(email);
  const now = Date.now();
  const record = attemptsByEmail.get(key);

  if (!record || now - record.firstFailureAt > WINDOW_MS) {
    attemptsByEmail.set(key, {
      failures: 1,
      firstFailureAt: now,
      lockedUntil: 0,
    });
    return;
  }

  record.failures += 1;
  if (record.failures >= LOGIN_MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
  }
}

export function recordLoginSuccess(email: string): void {
  attemptsByEmail.delete(normalizeEmail(email));
}

/** @internal Test helper */
export function resetLoginRateLimitStore(): void {
  attemptsByEmail.clear();
}
