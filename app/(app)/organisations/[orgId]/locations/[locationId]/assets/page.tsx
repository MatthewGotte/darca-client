import EquipmentDashboard from "@/components/assets/equipment-dashboard";

export default async function AssetsPage({
  params,
}: {
  params: Promise<{ orgId: string; locationId: string }>;
}) {
  const { orgId, locationId } = await params;
  return <EquipmentDashboard orgId={orgId} locationId={locationId} />;
}
