"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Alert, Button, Flex, Form, Input, Spin, Typography } from "antd";

const { Title, Paragraph } = Typography;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const resetSuccess = searchParams.get("reset") === "success";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
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
    <Flex vertical gap={16}>
      <div>
        <Title level={3} style={{ marginBottom: 8 }}>
          Sign in
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Enter your email and password. If you do not have an account, please
          contact your administrator.
        </Paragraph>
      </div>

      {resetSuccess ? (
        <Alert
          type="success"
          message="Your password has been reset. You can sign in now."
          showIcon
        />
      ) : null}

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
        <Form.Item label="Password" required>
          <Input.Password
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Item>
        <Flex justify="flex-end">
          <Link href="/forgot-password">Forgot password?</Link>
        </Flex>
        <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<Spin />}>
      <LoginFormContent />
    </Suspense>
  );
}
