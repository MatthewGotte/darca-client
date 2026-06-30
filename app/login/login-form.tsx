"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Alert, Button, Form, Input } from "antd";
import type { FormProps } from "antd";
import {
  getInvalidCredentialsAlert,
  getLockoutAlert,
} from "@/lib/auth/login-rate-limit-messages";
import { getSafeCallbackUrl } from "@/lib/auth/safe-redirect";
import styles from "./login-form.module.css";

type LoginFields = {
  email: string;
  password: string;
};

type LoginFormProps = {
  callbackUrl: string;
  resetSuccess: boolean;
};

type LoginAlert = {
  message: string;
  description?: string;
};

async function fetchLoginAttemptStatus(email: string) {
  const response = await fetch("/api/auth/login-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    return null;
  }

  return response.json() as Promise<{
    locked: boolean;
    attemptsRemaining: number;
    retryAfterSeconds?: number;
  }>;
}

export default function LoginForm({ callbackUrl, resetSuccess }: LoginFormProps) {
  const safeCallbackUrl = getSafeCallbackUrl(callbackUrl);

  const [form] = Form.useForm<LoginFields>();
  const [alert, setAlert] = useState<LoginAlert | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish: FormProps<LoginFields>["onFinish"] = async ({
    email,
    password,
  }) => {
    setAlert(null);
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const status = await fetchLoginAttemptStatus(email);

        if (result.code === "rate_limit_exceeded" || status?.locked) {
          const retryAfterSeconds = status?.retryAfterSeconds ?? 15 * 60;
          setAlert(getLockoutAlert(retryAfterSeconds));
        } else {
          setAlert(
            getInvalidCredentialsAlert(status?.attemptsRemaining ?? 4)
          );
        }
        return;
      }

      if (!result?.ok) {
        setAlert({
          message: "Unable to sign in",
          description: "Something went wrong. Please try again in a moment.",
        });
        return;
      }

      window.location.assign(safeCallbackUrl);
    } catch {
      setAlert({
        message: "Unable to sign in",
        description: "Something went wrong. Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {(resetSuccess || alert) && (
        <div className={styles.alerts}>
          {resetSuccess ? (
            <Alert
              type="success"
              message="Your password has been reset. You can sign in now."
              showIcon
            />
          ) : null}
          {alert ? (
            <Alert
              type="error"
              message={alert.message}
              description={alert.description}
              showIcon
            />
          ) : null}
        </div>
      )}

      <Form<LoginFields>
        form={form}
        layout="vertical"
        requiredMark={false}
        className={styles.form}
        onFinish={handleFinish}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Enter your email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input
            size="large"
            type="email"
            autoComplete="email"
            placeholder="Email address"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Enter your password" }]}
        >
          <Input.Password
            size="large"
            autoComplete="current-password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item className={styles.submitItem}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isSubmitting}
            className={styles.submit}
          >
            Sign in
          </Button>
        </Form.Item>

        <div className={styles.forgotWrap}>
          <Link href="/forgot-password" className={styles.forgotLink}>
            Forgot password?
          </Link>
        </div>
      </Form>
    </>
  );
}
