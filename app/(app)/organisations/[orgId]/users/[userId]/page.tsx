import UserDetail from "@/components/users/user-detail";

export default async function UserPage({
  params,
}: {
  params: Promise<{ orgId: string; userId: string }>;
}) {
  const { orgId, userId } = await params;
  return <UserDetail orgId={orgId} userId={userId} />;
}
