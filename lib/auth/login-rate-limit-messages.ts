import {
  LOGIN_LOCKOUT_MINUTES,
  LOGIN_MAX_ATTEMPTS,
} from "@/lib/auth/login-rate-limit";

export function formatRetryDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? "" : "s"}`;
  }

  const minutes = Math.ceil(seconds / 60);
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

export function getLockoutAlert(retryAfterSeconds: number): {
  message: string;
  description: string;
} {
  const waitTime = formatRetryDuration(retryAfterSeconds);

  return {
    message: "Sign-in temporarily locked",
    description: `After ${LOGIN_MAX_ATTEMPTS} incorrect password attempts, sign-in is paused for ${LOGIN_LOCKOUT_MINUTES} minutes to protect your account. You can try again in about ${waitTime}, or reset your password using the link below if you've forgotten it.`,
  };
}

export function getInvalidCredentialsAlert(attemptsRemaining: number): {
  message: string;
  description?: string;
} {
  if (attemptsRemaining <= 0) {
    return {
      message: "Invalid email or password",
    };
  }

  if (attemptsRemaining === 1) {
    return {
      message: "Invalid email or password",
      description: `One more failed attempt will lock sign-in for ${LOGIN_LOCKOUT_MINUTES} minutes.`,
    };
  }

  return {
    message: "Invalid email or password",
    description: `${attemptsRemaining} attempts remaining before sign-in is temporarily locked.`,
  };
}
