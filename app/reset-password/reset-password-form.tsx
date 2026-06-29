"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { resetPassword, validateResetToken } from "@/lib/auth/server-api";

type FormState = "validating" | "invalid" | "valid";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formState, setFormState] = useState<FormState>(() =>
    token ? "validating" : "invalid"
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    async function validate() {
      const valid = await validateResetToken(token!);
      if (!cancelled) {
        setFormState(valid ? "valid" : "invalid");
      }
    }

    void validate();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setFormState("invalid");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token, password);
      router.push("/login?reset=success");
    } catch {
      const stillValid = await validateResetToken(token);
      if (!stillValid) {
        setFormState("invalid");
      } else {
        setError("Unable to reset password. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (formState === "validating") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (formState === "invalid") {
    return (
      <Box sx={{ display: "grid", gap: 2 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
          Reset password
        </Typography>
        <Alert severity="error">
          This reset link is invalid or has expired.
        </Alert>
        <Button component={Link} href="/forgot-password" variant="contained">
          Request a new link
        </Button>
        <Button component={Link} href="/login" variant="text">
          Back to sign in
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
        Choose a new password
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Enter and confirm your new password.
      </Typography>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <TextField
        label="New password"
        type="password"
        autoComplete="new-password"
        required
        fullWidth
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <TextField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        required
        fullWidth
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
      >
        {isSubmitting ? "Resetting..." : "Reset password"}
      </Button>
      <Button component={Link} href="/login" variant="text">
        Back to sign in
      </Button>
    </Box>
  );
}
