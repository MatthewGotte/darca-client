import { Skeleton } from "antd";

export default function PageLoadingSkeleton({
  rows = 4,
}: {
  rows?: number;
}) {
  return <Skeleton active paragraph={{ rows }} />;
}
