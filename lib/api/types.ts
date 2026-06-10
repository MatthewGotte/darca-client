import type { components, paths } from "./generated/schema";

export type { components, paths };

export type Schema<T extends keyof components["schemas"]> =
  components["schemas"][T];

type HttpMethod = "get" | "put" | "post" | "delete" | "patch" | "head" | "options";

type Operation<
  Path extends keyof paths,
  Method extends HttpMethod,
> = Method extends keyof paths[Path] ? paths[Path][Method] : never;

type ResponseContent<Responses, Code extends keyof Responses> =
  Responses[Code] extends {
    content: { "application/json": infer T };
  }
    ? T
    : Responses[Code] extends { content: { "*/*": infer T } }
      ? T
      : never;

export type ApiResponse<
  Path extends keyof paths,
  Method extends HttpMethod,
  Code extends keyof NonNullable<Operation<Path, Method>>["responses"],
> = ResponseContent<
  NonNullable<Operation<Path, Method>>["responses"],
  Code
>;

export type ApiRequestBody<
  Path extends keyof paths,
  Method extends HttpMethod,
> = NonNullable<Operation<Path, Method>> extends {
  requestBody: { content: { "application/json": infer T } };
}
  ? T
  : never;

export type ApiQueryParams<
  Path extends keyof paths,
  Method extends HttpMethod,
> = NonNullable<Operation<Path, Method>> extends {
  parameters: { query?: infer T };
}
  ? T
  : never;

export type AssetStatus =
  NonNullable<Schema<"AssetSummaryResponse">["status"]>;

export type JobStatus = NonNullable<Schema<"JobSummaryResponse">["status"]>;

export type JobPriority = NonNullable<Schema<"JobSummaryResponse">["priority"]>;
