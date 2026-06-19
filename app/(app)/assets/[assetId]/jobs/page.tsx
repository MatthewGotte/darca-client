import RequireLocationId from "@/components/assets/require-location-id";
import JobsList from "@/components/jobs/jobs-list";

export default async function AssetJobsPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  return (
    <RequireLocationId>
      {(locationId) => <JobsList assetId={assetId} locationId={locationId} />}
    </RequireLocationId>
  );
}
