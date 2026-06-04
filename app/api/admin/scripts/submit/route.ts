import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminPassword,
  verifyAdminPassword,
} from "../../../../../lib/scripts/admin-auth";
import { isAuthorizedAdminRequest } from "../../../../../lib/scripts/admin-request";
import { saveAdminScriptSubmission } from "../../../../../lib/scripts/admin-submit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const isSsoMode = process.env.OPERATOROS_AUTH_MODE === "sso";

  if (!isSsoMode && !getAdminPassword()) {
    return NextResponse.json(
      { error: "ADMIN_SUBMISSION_PASSWORD must be set to a non-default value." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const action = readString(formData, "action");
  const adminPassword = readString(formData, "admin_password");

  if (action === "authenticate") {
    if (!verifyAdminPassword(adminPassword)) {
      return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  }

  if (!(await isAuthorizedAdminRequest(request, adminPassword, ["scriptforge_admin", "scriptforge_contributor"]))) {
    return NextResponse.json({ error: "Admin password is required." }, { status: 401 });
  }

  try {
    const scriptBody = await getScriptBody(formData);
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
      review_status: readReviewStatus(formData),
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
