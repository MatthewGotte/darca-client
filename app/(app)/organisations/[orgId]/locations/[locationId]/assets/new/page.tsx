import { redirect } from "next/navigation";
import { locationPath } from "@/lib/routes";

export default async function NewAssetPage({
  params,
}: {
  params: Promise<{ orgId: string; locationId: string }>;
}) {
  const { orgId, locationId } = await params;
  redirect(locationPath(orgId, locationId, "/assets"));
}
