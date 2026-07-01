import { Button, Result } from "antd";
import Link from "@/components/link";

export default function DashboardNotFound() {
  return (
    <Result
      status="404"
      title="Page not found"
      subTitle="The page you are looking for does not exist or you may not have access."
      extra={
        <Link href="/">
          <Button type="primary">Back to Home</Button>
        </Link>
      }
    />
  );
}
