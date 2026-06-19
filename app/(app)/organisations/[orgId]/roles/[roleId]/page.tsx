import RoleDetail from "@/components/rbac/role-detail";

export default async function RolePage({
  params,
}: {
  params: Promise<{ orgId: string; roleId: string }>;
}) {
  const { orgId, roleId } = await params;
  return <RoleDetail orgId={orgId} roleId={roleId} />;
}
