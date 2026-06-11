import PeopleDashboard from "@/components/users/people-dashboard";

export default async function UsersPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <PeopleDashboard orgId={orgId} />;
}
