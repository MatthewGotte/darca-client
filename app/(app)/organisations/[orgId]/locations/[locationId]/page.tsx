import LocationDetail from "@/components/locations/location-detail";

export default async function LocationPage({
  params,
}: {
  params: Promise<{ orgId: string; locationId: string }>;
}) {
  const { orgId, locationId } = await params;
  return <LocationDetail orgId={orgId} locationId={locationId} />;
}
