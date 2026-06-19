import RolePermissionsEditor from "@/components/rbac/role-permissions-editor";

export default async function RolePermissionsPage({
  params,
}: {
  params: Promise<{ orgId: string; roleId: string }>;
}) {
  const { orgId, roleId } = await params;
  return <RolePermissionsEditor orgId={orgId} roleId={roleId} />;
}
