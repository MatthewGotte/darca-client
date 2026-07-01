"use client";

import type { ReactNode } from "react";
import { Button, Empty } from "antd";

type EmptyStateProps = {
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export default function EmptyState({
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <Empty
      image={icon ?? Empty.PRESENTED_IMAGE_SIMPLE}
      description={description}
    >
      {actionLabel && onAction ? (
        <Button type="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Empty>
  );
}
