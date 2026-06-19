import CreateJobForm from "@/components/jobs/create-job-form";

export default async function NewAssetJobPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  return <CreateJobForm assetId={assetId} />;
}
