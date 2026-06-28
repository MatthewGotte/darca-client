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

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const { getSession } = await import("next-auth/react");
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status ?? 0;

    if (status === 401 && typeof window !== "undefined") {
      const { signOut } = await import("next-auth/react");
      await signOut({ callbackUrl: "/login" });
    }

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
