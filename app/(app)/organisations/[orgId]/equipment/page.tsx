import { redirect } from "next/navigation";
import { listOrganisationLocations } from "@/lib/api/api";
import { locationPath, orgPath } from "@/lib/routes";

export default async function OrgEquipmentPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;

  let locations: Awaited<ReturnType<typeof listOrganisationLocations>> = [];
  try {
    locations = await listOrganisationLocations(orgId);
  } catch {
    redirect(orgPath(orgId, "/locations"));
  }

  if (locations.length === 0) {
    redirect(orgPath(orgId, "/locations"));
  }

  redirect(locationPath(orgId, locations[0].id!, "/assets"));
}
