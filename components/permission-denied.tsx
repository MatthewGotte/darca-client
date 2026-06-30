"use client";

import { LockOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import Link from "@/components/link";

export default function PermissionDenied() {
  return (
    <Result
      status="403"
      icon={<LockOutlined style={{ fontSize: 64, color: "#bfbfbf" }} />}
      title="Access Denied"
      subTitle="You don't have permission to view this page."
      extra={
        <Link href="/">
          <Button type="primary">Back to Home</Button>
        </Link>
      }
    />
  );
}
