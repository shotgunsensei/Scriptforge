import { NextResponse, type NextRequest } from "next/server";
import YAML from "yaml";
import { verifyTurnstileToken } from "../../../../../lib/scripts/captcha";
import {
  getBlankCommunityTemplate,
  getCommunityUploadMaxKb,
  isCommunityUploadEnabled,
  saveCommunityScriptSubmission,
  validateCommunityUploadFile,
  type CommunityScriptSubmissionInput,
} from "../../../../../lib/scripts/community-submit";
import { getRateLimitAdapter } from "../../../../../lib/scripts/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MetadataTemplate = Record<string, unknown>;

export async function GET(request: NextRequest) {
  const template = getBlankCommunityTemplate();
  const format = request.nextUrl.searchParams.get("template")?.toLowerCase();

  if (format === "yaml" || format === "yml") {
    return new NextResponse(YAML.stringify(template), {
      headers: {
        "content-type": "application/yaml; charset=utf-8",
        "content-disposition": 'attachment; filename="scriptforge-community-template.yaml"',
      },
    });
  }

  return new NextResponse(`${JSON.stringify(template, null, 2)}\n`, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="scriptforge-community-template.json"',
    },
  });
}

export async function POST(request: NextRequest) {
  if (!isCommunityUploadEnabled()) {
    return NextResponse.json({ error: "Community uploads are disabled." }, { status: 403 });
  }

  const clientKey = getClientRateLimitKey(request);
  const rateLimit = await getRateLimitAdapter().check(`community-submit:${clientKey}`, 10, 60_000);
  if (!rateLimit.ok) {
    return NextResponse.json({ error: rateLimit.error ?? "Rate limit exceeded." }, { status: 429 });
  }

  const formData = await request.formData();
  const captcha = await verifyTurnstileToken(readString(formData, "captcha_token"), clientKey);
  if (!captcha.ok) {
    return NextResponse.json({ error: captcha.error }, { status: 400 });
  }

  try {
    const maxKb = getCommunityUploadMaxKb();
    const metadata = await getMetadataTemplate(formData, maxKb);
    const { body, extension } = await getScriptBody(formData, maxKb);

    if (Buffer.byteLength(body, "utf8") > maxKb * 1024) {
      throw new Error(`Script body exceeds ${maxKb} KB limit.`);
    }

    const result = await saveCommunityScriptSubmission({
      title: readMergedString(formData, metadata, "title", true),
      slug: readMergedString(formData, metadata, "slug", false) || undefined,
      version: readMergedString(formData, metadata, "version", true) || "1.0.0",
      category: readMergedString(formData, metadata, "category", true),
      subcategory: readMergedString(formData, metadata, "subcategory", false) || undefined,
      tags: readMergedTags(formData, metadata),
      author_name: readNestedString(formData, metadata, "author_name", ["author", "name"], true),
      author_email: readNestedString(formData, metadata, "author_email", ["author", "email"], false) || undefined,
      author_organization:
        readNestedString(formData, metadata, "author_organization", ["author", "organization"], false) || undefined,
      summary: readMergedString(formData, metadata, "summary", true),
      description: readMergedString(formData, metadata, "description", true),
      use_case: readMergedString(formData, metadata, "use_case", true),
      requirements: readMergedList(formData, metadata, "requirements"),
      parameters: readMergedList(formData, metadata, "parameters"),
      examples: readMergedList(formData, metadata, "examples"),
      output_format: readOutputFormat(formData, metadata),
      output_description: readNestedString(formData, metadata, "output_description", ["output", "description"], false) || undefined,
      script_body: body,
      script_extension: extension,
      documentation_readme:
        readNestedString(formData, metadata, "documentation_readme", ["documentation", "readme"], false) || undefined,
      documentation_changelog:
        readNestedString(formData, metadata, "documentation_changelog", ["documentation", "changelog"], false) ||
        undefined,
      monetization_tier: readMonetizationTier(formData, metadata),
      entitlement_required: false,
      submitter_name: readNestedString(formData, metadata, "submitter_name", ["submitter", "name"], true),
      submitter_email: readNestedString(formData, metadata, "submitter_email", ["submitter", "email"], true),
      submitter_organization:
        readNestedString(formData, metadata, "submitter_organization", ["submitter", "organization"], false) ||
        undefined,
      license: readMergedString(formData, metadata, "license", true),
      attribution_required: formData.get("attribution_required") === "true" || metadata.attribution_required === true,
    } satisfies CommunityScriptSubmissionInput);

    return NextResponse.json({
      ok: true,
      folderPath: result.folderPath,
      files: result.files,
      submission: {
        slug: result.submission.slug,
        review_status: result.submission.review_status,
        source_type: result.submission.source_type,
        safety: result.submission.safety,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Community submission failed.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

function getClientRateLimitKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return forwardedFor || request.headers.get("x-real-ip") || "anonymous";
}

async function getMetadataTemplate(formData: FormData, maxKb: number): Promise<MetadataTemplate> {
  const upload = formData.get("metadata_file");

  if (!(upload instanceof File) || upload.size === 0) {
    return {};
  }

  const extension = validateCommunityUploadFile(upload.name, upload.size, maxKb);

  if (![".json", ".yaml", ".yml"].includes(extension)) {
    throw new Error("Metadata upload must be .json, .yaml, or .yml.");
  }

  const text = await upload.text();
  const parsed = extension === ".json" ? JSON.parse(text) : YAML.parse(text);

  return isRecord(parsed) ? parsed : {};
}

async function getScriptBody(formData: FormData, maxKb: number): Promise<{ body: string; extension: ".ps1" | ".psm1" }> {
  const upload = formData.get("script_file");

  if (upload instanceof File && upload.size > 0) {
    const extension = validateCommunityUploadFile(upload.name, upload.size, maxKb);

    if (extension !== ".ps1" && extension !== ".psm1") {
      throw new Error("Script upload must be .ps1 or .psm1.");
    }

    return {
      body: await upload.text(),
      extension,
    };
  }

  return {
    body: requireString(formData, "script_body"),
    extension: ".ps1",
  };
}

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function requireString(formData: FormData, key: string): string {
  const value = readString(formData, key);

  if (!value) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

function readMergedString(formData: FormData, metadata: MetadataTemplate, key: string, required: boolean): string {
  const formValue = readString(formData, key);
  const metadataValue = metadata[key];
  const value = formValue || (typeof metadataValue === "string" ? metadataValue.trim() : "");

  if (required && !value) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

function readNestedString(
  formData: FormData,
  metadata: MetadataTemplate,
  formKey: string,
  metadataPath: [string, string],
  required: boolean,
): string {
  const formValue = readString(formData, formKey);
  const parent = metadata[metadataPath[0]];
  const metadataValue = isRecord(parent) ? parent[metadataPath[1]] : undefined;
  const value = formValue || (typeof metadataValue === "string" ? metadataValue.trim() : "");

  if (required && !value) {
    throw new Error(`${formKey} is required.`);
  }

  return value;
}

function readMergedTags(formData: FormData, metadata: MetadataTemplate): string[] {
  const formValue = readString(formData, "tags");

  if (formValue) {
    return splitLinesOrCommas(formValue);
  }

  return Array.isArray(metadata.tags) ? metadata.tags.filter((tag): tag is string => typeof tag === "string") : [];
}

function readMergedList(formData: FormData, metadata: MetadataTemplate, key: string): string[] {
  const formValue = readString(formData, key);

  if (formValue) {
    return splitLines(formValue);
  }

  const metadataValue = metadata[key];

  if (!Array.isArray(metadataValue)) {
    return [];
  }

  return metadataValue
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      if (isRecord(item) && typeof item.name === "string") {
        return item.name;
      }

      if (isRecord(item) && typeof item.command === "string") {
        return item.command;
      }

      return "";
    })
    .map((item) => item.trim())
    .filter(Boolean);
}

function readOutputFormat(formData: FormData, metadata: MetadataTemplate) {
  const value = readString(formData, "output_format") || getNestedMetadataString(metadata, ["output", "format"]);
  const allowed = ["text", "json", "csv", "html", "none"] as const;

  return allowed.includes(value as (typeof allowed)[number]) ? (value as (typeof allowed)[number]) : "text";
}

function readMonetizationTier(formData: FormData, metadata: MetadataTemplate) {
  const value =
    readString(formData, "monetization_tier") || getNestedMetadataString(metadata, ["monetization", "tier"]);
  const allowed = ["free", "starter", "pro", "business", "operator", "elite", "addon"] as const;

  return allowed.includes(value as (typeof allowed)[number]) ? (value as (typeof allowed)[number]) : "free";
}

function getNestedMetadataString(metadata: MetadataTemplate, path: [string, string]): string {
  const parent = metadata[path[0]];
  const value = isRecord(parent) ? parent[path[1]] : undefined;

  return typeof value === "string" ? value : "";
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLinesOrCommas(value: string): string[] {
  return value
    .split(/[\r\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
