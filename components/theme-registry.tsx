"use client";

import { App, ConfigProvider } from "antd";
import { AxiosErrorInterceptor } from "@/components/axios-error-interceptor";
import theme from "@/theme";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider theme={theme}>
      <App>
        <AxiosErrorInterceptor />
        {children}
      </App>
    </ConfigProvider>
  );
}
