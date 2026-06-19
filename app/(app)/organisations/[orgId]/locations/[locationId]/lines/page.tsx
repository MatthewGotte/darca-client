import LinesList from "@/components/locations/lines-list";

export default async function LinesPage({
  params,
}: {
  params: Promise<{ orgId: string; locationId: string }>;
}) {
  const { orgId, locationId } = await params;
  return <LinesList orgId={orgId} locationId={locationId} />;
}
