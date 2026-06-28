"use client";

import useSWR from "swr";
import { changePassword, getMe } from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";
import { useApiMutation } from "@/lib/api/swr";
import type { ChangePasswordRequest } from "@/lib/api/types";

export function useMe(enabled = true) {
  return useSWR(enabled ? queryKeys.me() : null, getMe);
}

export function useChangePassword() {
  return useApiMutation<ChangePasswordRequest, void>(
    "mutation:change-password",
    (body) => changePassword(body)
  );
}
