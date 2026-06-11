import CreateRoleForm from "@/components/rbac/create-role-form";

export default async function NewRolePage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <CreateRoleForm orgId={orgId} />;
}
