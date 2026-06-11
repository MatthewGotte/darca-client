import LineDetail from "@/components/locations/line-detail";

export default async function LinePage({
  params,
}: {
  params: Promise<{ orgId: string; locationId: string; lineId: string }>;
}) {
  const { orgId, locationId, lineId } = await params;
  return <LineDetail orgId={orgId} locationId={locationId} lineId={lineId} />;
}
