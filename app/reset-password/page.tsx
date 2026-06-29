import Image from "next/image";
import { Suspense } from "react";
import { Card, Flex, Spin } from "antd";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: "48px 16px",
      }}
    >
      <Flex vertical align="center" style={{ width: "100%", maxWidth: 480 }}>
        <Flex justify="center" style={{ marginBottom: 32 }}>
          <Image
            src="/darca-logo.jpeg"
            alt="DARCA Asset Management"
            width={360}
            height={98}
            priority
            style={{ height: 98, width: "auto" }}
          />
        </Flex>
        <Card style={{ width: "100%" }}>
          <Suspense fallback={<Spin />}>
            <ResetPasswordForm />
          </Suspense>
        </Card>
      </Flex>
    </main>
  );
}
