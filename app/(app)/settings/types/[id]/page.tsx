import TypeDetail from "@/components/catalog/type-detail";

export default async function TypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TypeDetail typeId={id} />;
}
