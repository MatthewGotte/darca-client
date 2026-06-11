import CustomFieldDetail from "@/components/catalog/custom-field-detail";

export default async function CustomFieldPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomFieldDetail fieldId={id} />;
}
