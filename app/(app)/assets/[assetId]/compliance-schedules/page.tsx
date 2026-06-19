import ComplianceSchedulesList from "@/components/assets/compliance-schedules-list";
import RequireLocationId from "@/components/assets/require-location-id";

export default async function AssetComplianceSchedulesPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  return (
    <RequireLocationId>
      {(locationId) => (
        <ComplianceSchedulesList assetId={assetId} locationId={locationId} />
      )}
    </RequireLocationId>
  );
}
