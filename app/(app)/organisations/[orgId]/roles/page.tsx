import RolesList from "@/components/rbac/roles-list";

export default async function RolesPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <RolesList orgId={orgId} />;
}
