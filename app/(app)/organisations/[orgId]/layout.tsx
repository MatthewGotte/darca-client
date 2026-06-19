import SyncOrgFromPath from "@/components/layout/sync-org-from-path";

export default async function OrganisationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return (
    <>
      <SyncOrgFromPath orgId={orgId} />
      {children}
    </>
  );
}
