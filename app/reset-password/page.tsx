"use client";

import { Suspense } from "react";
import { Card, Flex, Spin, Typography } from "antd";
import ResetPasswordForm from "./reset-password-form";

const { Title, Text } = Typography;

export default function ResetPasswordPage() {
  return (
    <Flex
      align="center"
      justify="center"
      style={{ minHeight: "100vh", background: "#f0f2f5" }}
    >
      <Card style={{ width: 400 }}>
        <Flex vertical align="center" gap={24}>
          <Flex vertical align="center" gap={8}>
            <Title level={3} style={{ margin: 0 }}>
              DARCA
            </Title>
            <Text type="secondary">Choose a new password</Text>
          </Flex>
          <Suspense fallback={<Spin />}>
            <ResetPasswordForm />
          </Suspense>
        </Flex>
      </Card>
    </Flex>
  );
}
