"use client";

import { App } from "antd";
import { useEffect } from "react";
import {
  getApiErrorNotification,
  registerApiErrorNotifier,
  unregisterApiErrorNotifier,
  type ApiClientError,
} from "@/lib/api/api-errors";

export function AxiosErrorInterceptor() {
  const { notification } = App.useApp();

  useEffect(() => {
    registerApiErrorNotifier((error: ApiClientError) => {
      const { title, description } = getApiErrorNotification(error);
      notification.error({
        title,
        description,
        placement: "bottomRight",
        duration: error.status >= 500 ? 8 : 6,
      });
    });

    return () => {
      unregisterApiErrorNotifier();
    };
  }, [notification]);

  return null;
}
