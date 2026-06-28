"use client";

import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";

export function matchKey(prefix: readonly unknown[]) {
  return (key: unknown): boolean => {
    if (!Array.isArray(key)) return false;
    return prefix.every((segment, index) => key[index] === segment);
  };
}

type InvalidatePrefix = readonly unknown[];

type UseApiMutationOptions<TArg, TResult> = {
  invalidate?: InvalidatePrefix[];
  onSuccess?: (result: TResult, arg: TArg) => void | Promise<void>;
};

export function useApiMutation<TArg, TResult>(
  key: string,
  mutationFn: (arg: TArg) => Promise<TResult>,
  options: UseApiMutationOptions<TArg, TResult> = {}
) {
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error, reset, data } = useSWRMutation<
    TResult,
    Error,
    string,
    TArg
  >(
    key,
    async (_key, { arg }) => {
      const result = await mutationFn(arg);
      if (options.invalidate) {
        await Promise.all(
          options.invalidate.map((prefix) => mutate(matchKey(prefix)))
        );
      }
      await options.onSuccess?.(result, arg);
      return result;
    }
  );

  return { trigger, isMutating, error, reset, data };
}
