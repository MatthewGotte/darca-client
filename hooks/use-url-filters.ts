"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlFilter(name: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get(name) ?? undefined;

  const setValue = useCallback(
    (next: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === undefined || next === "") {
        params.delete(name);
      } else {
        params.set(name, next);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [name, pathname, router, searchParams]
  );

  return [value, setValue] as const;
}
