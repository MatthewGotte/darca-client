import type { ApiError } from "./axios-config";

export type ApiClientError = ApiError;

export function getApiErrorNotification(error: ApiClientError) {
  const title = error.status >= 500 ? "Server error" : "Request failed";
  const description = error.message || "An unexpected error occurred";
  return { title, description };
}

type ApiErrorNotifier = (error: ApiClientError) => void;

let notifier: ApiErrorNotifier | null = null;

export function registerApiErrorNotifier(fn: ApiErrorNotifier) {
  notifier = fn;
}

export function unregisterApiErrorNotifier() {
  notifier = null;
}

export function notifyApiError(error: ApiClientError) {
  notifier?.(error);
}
