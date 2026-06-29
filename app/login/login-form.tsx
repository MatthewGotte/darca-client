"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const resetSuccess = searchParams.get("reset") === "success";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
        Sign in
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Enter your email and password. If you do not have an account, please contact your administrator.
      </Typography>

      {resetSuccess ? (
        <Alert severity="success">Your password has been reset. You can sign in now.</Alert>
      ) : null}

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
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        fullWidth
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button component={Link} href="/forgot-password" variant="text" size="small">
          Forgot password?
        </Button>
      </Box>
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </Box>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<CircularProgress size={24} />}>
      <LoginFormContent />
    </Suspense>
  );
}
