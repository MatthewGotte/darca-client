import CategoryDetail from "@/components/catalog/category-detail";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryDetail categoryId={id} />;
}
