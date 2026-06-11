import OrgOverview from "@/components/organisations/org-overview";

export default async function OrganisationPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <OrgOverview orgId={orgId} />;
}
