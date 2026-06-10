import axios, { type AxiosError, isAxiosError } from "axios";
import { API_HOSTS } from "@/lib/config/api-hosts";

export interface ApiErrorBody {
  timestamp?: string;
  status?: number;
  error?: string;
  code?: string;
  message?: string;
  detail?: string;
  path?: string;
  fieldErrors?: Array<{ field?: string; message?: string }>;
}

export class ApiError extends Error {
  readonly status: number;
  readonly body?: ApiErrorBody;

  constructor(message: string, status: number, body?: ApiErrorBody) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? API_HOSTS.local;
}

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status ?? 0;
    const body = error.response?.data;
    const message =
      body?.message ??
      body?.detail ??
      body?.error ??
      error.message ??
      "Request failed";

    return Promise.reject(new ApiError(message, status, body));
  }
);
