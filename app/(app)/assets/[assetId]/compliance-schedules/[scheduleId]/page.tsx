import ComplianceScheduleDetail from "@/components/assets/compliance-schedule-detail";
import RequireLocationId from "@/components/assets/require-location-id";

export default async function ComplianceSchedulePage({
  params,
}: {
  params: Promise<{ assetId: string; scheduleId: string }>;
}) {
  const { assetId, scheduleId } = await params;
  return (
    <RequireLocationId>
      {(locationId) => (
        <ComplianceScheduleDetail
          assetId={assetId}
          locationId={locationId}
          scheduleId={scheduleId}
        />
      )}
    </RequireLocationId>
  );
}
