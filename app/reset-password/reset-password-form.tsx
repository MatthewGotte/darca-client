"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, Flex, Form, Input, Spin, Typography } from "antd";
import { resetPassword, validateResetToken } from "@/lib/auth/server-api";

const { Title, Paragraph } = Typography;

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

  async function handleSubmit() {
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
      <Flex justify="center" style={{ padding: "32px 0" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (formState === "invalid") {
    return (
      <Flex vertical gap={16}>
        <Title level={3} style={{ marginBottom: 0 }}>
          Reset password
        </Title>
        <Alert
          type="error"
          message="This reset link is invalid or has expired."
          showIcon
        />
        <Link href="/forgot-password">
          <Button type="primary" block>
            Request a new link
          </Button>
        </Link>
        <Link href="/login">
          <Button type="link" block>
            Back to sign in
          </Button>
        </Link>
      </Flex>
    );
  }

  return (
    <Flex vertical gap={16}>
      <div>
        <Title level={3} style={{ marginBottom: 8 }}>
          Choose a new password
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Enter and confirm your new password.
        </Paragraph>
      </div>

      {error ? <Alert type="error" message={error} showIcon /> : null}

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="New password" required>
          <Input.Password
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Item>
        <Form.Item label="Confirm password" required>
          <Input.Password
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset password"}
          </Button>
        </Form.Item>
        <Link href="/login">
          <Button type="link" block>
            Back to sign in
          </Button>
        </Link>
      </Form>
    </Flex>
  );
}
