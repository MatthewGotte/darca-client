"use client";

import type { ReactNode } from "react";
import { Button, Drawer, Form } from "antd";
import type { FormInstance } from "antd";

type EntityFormDrawerProps<T> = {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
  loading?: boolean;
  width?: number;
  form: FormInstance<T>;
  children: ReactNode;
  submitLabel?: string;
};

export default function EntityFormDrawer<T>({
  title,
  open,
  onClose,
  onSubmit,
  loading,
  width = 480,
  form,
  children,
  submitLabel = "Save",
}: EntityFormDrawerProps<T>) {
  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      width={width}
      destroyOnHidden
      extra={
        <Button type="primary" loading={loading} onClick={() => void onSubmit()}>
          {submitLabel}
        </Button>
      }
    >
      <Form form={form} layout="vertical">
        {children}
      </Form>
    </Drawer>
  );
}
