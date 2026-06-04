import { NextResponse, type NextRequest } from "next/server";
import { getAuthorizedAdminPrincipal } from "../../../../../lib/scripts/admin-request";
import { saveAdminScriptSubmission } from "../../../../../lib/scripts/admin-submit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const adminPassword = readString(formData, "admin_password");

  let principal;
  try {
    principal = await getAuthorizedAdminPrincipal(request, adminPassword, [
      "scriptforge_admin",
      "scriptforge_contributor",
    ]);
  } catch {
    return NextResponse.json({ error: "Admin session is required." }, { status: 401 });
  }

  try {
    const scriptBody = await getScriptBody(formData);
    const powershellCompatibility = splitLinesOrCommas(readString(formData, "powershell_compatibility"));
    const reviewStatus = readReviewStatus(formData);

    if (!principal.roles.includes("scriptforge_admin") && reviewStatus === "approved") {
      return NextResponse.json({ error: "Contributors can save trusted drafts only." }, { status: 403 });
    }

    const result = await saveAdminScriptSubmission({
      title: requireString(formData, "title"),
      slug: readString(formData, "slug") || undefined,
      version: requireString(formData, "version"),
      category: requireString(formData, "category"),
      subcategory: readString(formData, "subcategory") || undefined,
      tags: splitLinesOrCommas(readString(formData, "tags")),
      author_name: requireString(formData, "author_name"),
      author_email: readString(formData, "author_email") || undefined,
      author_organization: readString(formData, "author_organization") || undefined,
      summary: requireString(formData, "summary"),
      description: requireString(formData, "description"),
      use_case: requireString(formData, "use_case"),
      requirements: splitLines(readString(formData, "requirements")),
      parameters: splitLines(readString(formData, "parameters")),
      examples: splitLines(readString(formData, "examples")),
      output_format: readOutputFormat(formData),
      output_description: readString(formData, "output_description") || undefined,
      script_body: scriptBody,
      documentation_readme: readString(formData, "documentation_readme") || undefined,
      documentation_changelog: readString(formData, "documentation_changelog") || undefined,
      monetization_tier: readMonetizationTier(formData),
      entitlement_required: formData.get("entitlement_required") === "true",
      addon_key: readString(formData, "addon_key") || undefined,
      github_repo_url: readString(formData, "github_repo_url") || null,
      github_file_url: readString(formData, "github_file_url") || null,
      github_commit_sha: readString(formData, "github_commit_sha") || null,
      github_last_synced_at: readString(formData, "github_last_synced_at") || null,
      last_tested_at: readString(formData, "last_tested_at") || null,
      powershell_compatibility: powershellCompatibility.length > 0 ? powershellCompatibility : undefined,
      safety_score: readNumber(formData, "safety_score"),
      documentation_score: readNumber(formData, "documentation_score"),
      community_rating: readNumber(formData, "community_rating"),
      download_count: readNumber(formData, "download_count") ?? 0,
      review_status: reviewStatus,
      reviewed_by: requireString(formData, "reviewed_by"),
      submitter_name: requireString(formData, "submitter_name"),
      submitter_email: requireString(formData, "submitter_email"),
      submitter_organization: readString(formData, "submitter_organization") || undefined,
      license: requireString(formData, "license"),
      attribution_required: formData.get("attribution_required") === "true",
    });

    return NextResponse.json({
      ok: true,
      folderPath: result.folderPath,
      files: result.files,
      submission: {
        slug: result.submission.slug,
        category: result.submission.category,
        review_status: result.submission.review_status,
        source_type: result.submission.source_type,
        safety: result.submission.safety,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission failed.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

function readNumber(formData: FormData, key: string): number | null {
  const value = readString(formData, key);

  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

async function getScriptBody(formData: FormData): Promise<string> {
  const upload = formData.get("script_file");

  if (upload instanceof File && upload.size > 0) {
    if (!upload.name.toLowerCase().endsWith(".ps1")) {
      throw new Error("Only .ps1 uploads are allowed.");
    }

    return upload.text();
  }

  return requireString(formData, "script_body");
}

function requireString(formData: FormData, key: string): string {
  const value = readString(formData, key);

  if (!value) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
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

function readReviewStatus(formData: FormData) {
  const value = readString(formData, "review_status");

  return value === "approved" ? "approved" : "trusted_draft";
}

function readOutputFormat(formData: FormData) {
  const value = readString(formData, "output_format");
  const allowed = ["text", "json", "csv", "html", "none"] as const;

  return allowed.includes(value as (typeof allowed)[number]) ? (value as (typeof allowed)[number]) : "text";
}

function readMonetizationTier(formData: FormData) {
  const value = readString(formData, "monetization_tier");
  const allowed = ["free", "starter", "pro", "business", "operator", "elite", "addon"] as const;

  return allowed.includes(value as (typeof allowed)[number]) ? (value as (typeof allowed)[number]) : "free";
}
