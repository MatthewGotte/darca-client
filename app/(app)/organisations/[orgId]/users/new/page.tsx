import CreateUserForm from "@/components/users/create-user-form";

export default async function NewUserPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <CreateUserForm orgId={orgId} />;
}
