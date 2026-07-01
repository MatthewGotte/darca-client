"use client";

import type { ReactNode } from "react";
import { Modal, Typography } from "antd";

type ConfirmDeleteProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  description?: ReactNode;
  confirmText?: string;
};

export default function ConfirmDelete({
  open,
  onConfirm,
  onCancel,
  loading = false,
  title = "Confirm Decommission",
  description = "This action cannot be undone. Are you sure you want to proceed?",
  confirmText = "Decommission",
}: ConfirmDeleteProps) {
  return (
    <Modal
      open={open}
      title={title}
      okText={confirmText}
      okButtonProps={{ danger: true, loading }}
      onOk={onConfirm}
      onCancel={onCancel}
      cancelButtonProps={{ disabled: loading }}
    >
      <Typography.Text>{description}</Typography.Text>
    </Modal>
  );
}
