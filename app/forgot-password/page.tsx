"use client";

import { Card, Flex, Typography } from "antd";
import ForgotPasswordForm from "./forgot-password-form";

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
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
            <Text type="secondary">Reset your password</Text>
          </Flex>
          <ForgotPasswordForm />
        </Flex>
      </Card>
    </Flex>
  );
}
