import Image from "next/image";
import { Card, Flex } from "antd";
import LoginForm from "./login-form";

export default function LoginPage() {
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
          <LoginForm />
        </Card>
      </Flex>
    </main>
  );
}
