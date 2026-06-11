import UserRolesEditor from "@/components/users/user-roles-editor";

export default async function UserRolesPage({
  params,
}: {
  params: Promise<{ orgId: string; userId: string }>;
}) {
  const { orgId, userId } = await params;
  return <UserRolesEditor orgId={orgId} userId={userId} />;
}
