export const API_HOSTS = {
  local: "http://localhost:8080/api/v1",
  development: "https://darca-service-development.up.railway.app/api/v1",
} as const;

export type ApiHostKey = keyof typeof API_HOSTS;

export const OPENAPI_SPEC_HOSTS = {
  local: "http://localhost:8080",
  development: "https://darca-service-development.up.railway.app",
} as const;
