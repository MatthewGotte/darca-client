import LocationsList from "@/components/locations/locations-list";

export default async function LocationsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <LocationsList orgId={orgId} />;
}
