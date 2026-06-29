"use client";

import { useState } from "react";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { requestPasswordReset } from "@/lib/auth/server-api";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Box sx={{ display: "grid", gap: 2 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
          Check your email
        </Typography>
        <Alert severity="success">
          If an account exists for that email, a reset link has been sent.
        </Alert>
        <Button component={Link} href="/login" variant="outlined">
          Back to sign in
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
        Reset password
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Enter your email address and we will send you a link to reset your password.
      </Typography>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        required
        fullWidth
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
      >
        {isSubmitting ? "Sending..." : "Send reset link"}
      </Button>
      <Button component={Link} href="/login" variant="text">
        Back to sign in
      </Button>
    </Box>
  );
}
