"use client";

import { useState } from "react";
import Link from "next/link";
import { Alert, Button, Flex, Form, Input, Typography } from "antd";
import { requestPasswordReset } from "@/lib/auth/server-api";

const { Title, Paragraph } = Typography;

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
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
      <Flex vertical gap={16}>
        <Title level={3} style={{ marginBottom: 0 }}>
          Check your email
        </Title>
        <Alert
          type="success"
          message="If an account exists for that email, a reset link has been sent."
          showIcon
        />
        <Link href="/login">
          <Button block>Back to sign in</Button>
        </Link>
      </Flex>
    );
  }

  return (
    <Flex vertical gap={16}>
      <div>
        <Title level={3} style={{ marginBottom: 8 }}>
          Reset password
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Enter your email address and we will send you a link to reset your
          password.
        </Paragraph>
      </div>

      {error ? <Alert type="error" message={error} showIcon /> : null}

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Email" required>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
            {isSubmitting ? "Sending..." : "Send reset link"}
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
