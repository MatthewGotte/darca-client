"use client";

import { OrgProvider } from "@/lib/context/org-context";
import { LocationProvider } from "@/lib/context/location-context";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrgProvider>
      <LocationProvider>{children}</LocationProvider>
    </OrgProvider>
  );
}
