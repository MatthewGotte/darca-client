import Box from "@mui/material/Box";
import JobHistoryTimeline from "@/components/jobs/job-history-timeline";
import PageHeader from "@/components/common/page-header";

export default async function JobHistoryPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  return (
    <Box>
      <PageHeader title="Job history" />
      <JobHistoryTimeline jobId={jobId} />
    </Box>
  );
}
