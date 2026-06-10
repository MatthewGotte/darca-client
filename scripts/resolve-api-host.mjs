import { API_HOSTS, OPENAPI_SPEC_HOSTS } from "./api-hosts.mjs";

export function parseRemoteHostArg(argv = process.argv.slice(2)) {
  const arg = argv.find((a) => a.startsWith("--remote-host="));
  if (!arg) return null;
  return arg.split("=")[1] ?? null;
}

export function resolveApiBaseUrl(argv = process.argv.slice(2)) {
  const remoteHost = parseRemoteHostArg(argv);
  if (remoteHost) {
    const baseUrl = API_HOSTS[remoteHost];
    if (!baseUrl) {
      throw new Error(
        `Unknown remote host "${remoteHost}". Available: ${Object.keys(API_HOSTS).join(", ")}`
      );
    }
    return baseUrl;
  }
  return API_HOSTS.local;
}

export function resolveOpenApiSpecUrl(argv = process.argv.slice(2)) {
  const remoteHost = parseRemoteHostArg(argv);
  if (remoteHost) {
    const specHost = OPENAPI_SPEC_HOSTS[remoteHost];
    if (!specHost) {
      throw new Error(
        `Unknown remote host "${remoteHost}". Available: ${Object.keys(OPENAPI_SPEC_HOSTS).join(", ")}`
      );
    }
    return `${specHost}/v3/api-docs`;
  }
  return `${OPENAPI_SPEC_HOSTS.local}/v3/api-docs`;
}

export function applyApiBaseUrlEnv(argv = process.argv.slice(2)) {
  process.env.NEXT_PUBLIC_API_BASE_URL = resolveApiBaseUrl(argv);
  return process.env.NEXT_PUBLIC_API_BASE_URL;
}
