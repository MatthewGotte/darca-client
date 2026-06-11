import CreateComplianceScheduleForm from "@/components/assets/create-compliance-schedule-form";
import RequireLocationId from "@/components/assets/require-location-id";

export default async function NewComplianceSchedulePage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  return (
    <RequireLocationId>
      {(locationId) => (
        <CreateComplianceScheduleForm assetId={assetId} locationId={locationId} />
      )}
    </RequireLocationId>
  );
}
