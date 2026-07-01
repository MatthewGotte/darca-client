import { use } from "react";
import { redirect } from "next/navigation";

export default function AssetsRedirectPage({
  params,
}: {
  params: Promise<{ locationId: string }>;
}) {
  const { locationId } = use(params);
  redirect(`/locations/${locationId}`);
}
