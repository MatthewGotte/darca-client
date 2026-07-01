"use client";

import { App } from "antd";

export function useAppMessage() {
  const { message, modal, notification } = App.useApp();
  return { message, modal, notification };
}
