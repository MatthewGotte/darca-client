import { spawn } from "node:child_process";
import { applyApiBaseUrlEnv } from "./resolve-api-host.mjs";

const argv = process.argv.slice(2);
const apiBaseUrl = applyApiBaseUrlEnv(argv);
const nextArgs = argv.filter((arg) => !arg.startsWith("--remote-host="));

console.log(`API base URL: ${apiBaseUrl}`);

const child = spawn("npx", ["next", "dev", ...nextArgs], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
