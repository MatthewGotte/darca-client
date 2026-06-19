import { Suspense } from "react";
import AssetHub from "@/components/assets/asset-hub";
import LoadingState from "@/components/common/loading-state";

export default async function AssetPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  return (
    <Suspense fallback={<LoadingState />}>
      <AssetHub assetId={assetId} />
    </Suspense>
  );
}
