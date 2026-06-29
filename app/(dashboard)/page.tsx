"use client";

import { Typography } from "antd";

const { Title, Text } = Typography;

export default function HomePage() {
  return (
    <div>
      <Title level={2}>Home</Title>
      <Text type="secondary">Welcome to DARCA Asset Intelligence.</Text>
    </div>
  );
}
