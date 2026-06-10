import { execSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveOpenApiSpecUrl } from "./resolve-api-host.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const specPath = path.join(rootDir, "openapi", "darca-api.json");
const outputPath = path.join(rootDir, "lib", "api", "generated", "schema.ts");

const specUrl = resolveOpenApiSpecUrl();
console.log(`Fetching OpenAPI spec from ${specUrl}...`);

let response;
try {
  response = await fetch(specUrl);
} catch (error) {
  console.error(
    `Failed to reach OpenAPI spec at ${specUrl}. Is darca-service running locally, or use --remote-host=development?`
  );
  throw error;
}

if (!response.ok) {
  throw new Error(
    `Failed to fetch OpenAPI spec (${response.status} ${response.statusText}) from ${specUrl}`
  );
}

const spec = await response.json();
await mkdir(path.dirname(specPath), { recursive: true });
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(specPath, `${JSON.stringify(spec, null, 2)}\n`);

console.log(`Wrote ${specPath}`);
console.log(`Generating TypeScript types at ${outputPath}...`);

execSync(
  `npx openapi-typescript "${specPath}" -o "${outputPath}"`,
  { cwd: rootDir, stdio: "inherit" }
);

console.log("Done.");
