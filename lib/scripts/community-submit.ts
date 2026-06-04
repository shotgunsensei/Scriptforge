import { extname } from "node:path";
import { z } from "zod";
import { logScriptAuditEvent } from "./audit";
import { createScriptSlug } from "./slug";
import { scanPowerShellSafety } from "./safety-scan";
import { scriptSubmissionSchema, type ScriptSubmission } from "./schema";
import { getScriptStorage } from "./storage";

export const COMMUNITY_ALLOWED_EXTENSIONS = [".ps1", ".psm1", ".json", ".yaml", ".yml"] as const;
export const DEFAULT_COMMUNITY_UPLOAD_MAX_KB = 250;

const communityAllowedExtensionSchema = z.enum(COMMUNITY_ALLOWED_EXTENSIONS);

export const communityScriptSubmissionInputSchema = z.object({
  title: z.string().trim().min(1).max(120),
  slug: z.string().trim().max(80).optional(),
  version: z.string().trim().regex(/^\d+\.\d+\.\d+$/),
  category: z.string().trim().min(1).max(80),
  subcategory: z.string().trim().max(80).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  author_name: z.string().trim().min(1).max(120),
  author_email: z.string().email().optional(),
  author_organization: z.string().trim().max(120).optional(),
  summary: z.string().trim().min(1).max(240),
  description: z.string().trim().min(1).max(5000),
  use_case: z.string().trim().min(1).max(2000),
  requirements: z.array(z.string().trim().min(1).max(500)).default([]),
  parameters: z.array(z.string().trim().min(1).max(500)).default([]),
  examples: z.array(z.string().trim().min(1).max(2000)).default([]),
  output_format: z.enum(["text", "json", "csv", "html", "none"]).default("text"),
  output_description: z.string().trim().max(1000).optional(),
  script_body: z.string().trim().min(1).max(200000),
  script_extension: z.enum([".ps1", ".psm1"]).default(".ps1"),
  documentation_readme: z.string().trim().max(20000).optional(),
  documentation_changelog: z.string().trim().max(10000).optional(),
  monetization_tier: z.enum(["free", "starter", "pro", "business", "operator", "elite", "addon"]).default("free"),
  entitlement_required: z.boolean().default(false),
  addon_key: z.string().trim().max(120).optional(),
  github_repo_url: z.string().url().nullable().optional(),
  github_file_url: z.string().url().nullable().optional(),
  github_commit_sha: z.string().trim().regex(/^[a-f0-9]{7,40}$/i).nullable().optional(),
  github_last_synced_at: z.string().datetime({ offset: true }).nullable().optional(),
  last_tested_at: z.string().datetime({ offset: true }).nullable().optional(),
  powershell_compatibility: z.array(z.string().trim().min(1).max(80)).optional(),
  safety_score: z.number().int().min(0).max(100).nullable().optional(),
  documentation_score: z.number().int().min(0).max(100).nullable().optional(),
  community_rating: z.number().min(0).max(5).nullable().optional(),
  download_count: z.number().int().min(0).optional(),
  submitter_name: z.string().trim().min(1).max(120),
  submitter_email: z.string().email(),
  submitter_organization: z.string().trim().max(120).optional(),
  license: z.string().trim().min(1).max(120),
  attribution_required: z.boolean().default(false),
});

export type CommunityScriptSubmissionInput = z.infer<typeof communityScriptSubmissionInputSchema>;

export type SaveCommunityScriptSubmissionResult = {
  submission: ScriptSubmission;
  folderPath: string;
  files: {
    script: string;
    metadata: string;
    readme: string;
  };
};

export function getCommunityUploadMaxKb(): number {
  const configured = Number.parseInt(process.env.COMMUNITY_UPLOAD_MAX_KB ?? "", 10);

  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_COMMUNITY_UPLOAD_MAX_KB;
}

export function isCommunityUploadEnabled(): boolean {
  return (process.env.ENABLE_COMMUNITY_UPLOADS ?? "true").toLowerCase() === "true";
}

export function validateCommunityUploadFile(fileName: string, sizeBytes: number, maxKb = getCommunityUploadMaxKb()) {
  const extension = extname(fileName).toLowerCase();

  if (!COMMUNITY_ALLOWED_EXTENSIONS.includes(extension as (typeof COMMUNITY_ALLOWED_EXTENSIONS)[number])) {
    throw new Error(`Unsupported upload extension: ${extension || "none"}.`);
  }

  if (sizeBytes > maxKb * 1024) {
    throw new Error(`Upload exceeds ${maxKb} KB limit.`);
  }

  return extension as z.infer<typeof communityAllowedExtensionSchema>;
}

export function getBlankCommunityTemplate() {
  return {
    title: "",
    slug: "",
    version: "1.0.0",
    category: "",
    subcategory: "",
    tags: [],
    author: {
      name: "",
      email: "",
      organization: "",
    },
    summary: "",
    description: "",
    use_case: "",
    safety: {
      risk_level: "low",
      scan_required: true,
      scan_status: "not_scanned",
      risk_flags: [],
      requires_admin: false,
      touches_network: false,
      touches_registry: false,
      touches_filesystem: false,
      notes: "Safety scan is completed by ScriptForge after upload.",
    },
    requirements: [],
    parameters: [],
    examples: [],
    output: {
      format: "text",
      description: "",
      sample: "",
    },
    script_body: "",
    documentation: {
      readme: "",
      changelog: "",
      references: [],
    },
    monetization: {
      tier: "free",
      entitlement_required: false,
      addon_key: "",
      upgrade_cta: "",
    },
    github_repo_url: null,
    github_file_url: null,
    github_commit_sha: null,
    github_last_synced_at: null,
    last_tested_at: null,
    powershell_compatibility: ["Windows PowerShell 5.1", "PowerShell 7"],
    safety_score: null,
    documentation_score: null,
    community_rating: null,
    download_count: 0,
    source_type: "community",
    review_status: "pending_review",
    reviewed_by: null,
    reviewed_at: null,
    submitter: {
      name: "",
      email: "",
      organization: "",
    },
    license: "",
    attribution_required: false,
  };
}

export async function saveCommunityScriptSubmission(
  input: CommunityScriptSubmissionInput,
  rootDir = process.cwd(),
): Promise<SaveCommunityScriptSubmissionResult> {
  const parsed = communityScriptSubmissionInputSchema.parse(input);
  const slug = parsed.slug ? createScriptSlug(parsed.slug) : createScriptSlug(parsed.title);
  const category = createScriptSlug(parsed.category);
  const safety = scanPowerShellSafety(parsed.script_body);

  const submission = scriptSubmissionSchema.parse({
    title: parsed.title,
    slug,
    version: parsed.version,
    category,
    subcategory: parsed.subcategory,
    tags: parsed.tags,
    author: {
      name: parsed.author_name,
      email: parsed.author_email,
      organization: parsed.author_organization,
    },
    summary: parsed.summary,
    description: parsed.description,
    use_case: parsed.use_case,
    safety,
    requirements: parsed.requirements.map((requirement) => ({
      name: requirement,
      required: true,
    })),
    parameters: parsed.parameters.map((parameter) => ({
      name: parameter,
      type: "string",
      description: parameter,
      required: false,
      sensitive: false,
    })),
    examples: parsed.examples.map((example, index) => ({
      title: `Example ${index + 1}`,
      command: example,
    })),
    output: {
      format: parsed.output_format,
      description: parsed.output_description,
    },
    script_body: parsed.script_body,
    documentation: {
      readme: parsed.documentation_readme,
      changelog: parsed.documentation_changelog,
      references: [],
    },
    monetization: {
      tier: parsed.monetization_tier,
      addon_key: parsed.addon_key,
      entitlement_required: parsed.entitlement_required,
    },
    github_repo_url: parsed.github_repo_url ?? null,
    github_file_url: parsed.github_file_url ?? null,
    github_commit_sha: parsed.github_commit_sha ?? null,
    github_last_synced_at: parsed.github_last_synced_at ?? null,
    last_tested_at: parsed.last_tested_at ?? null,
    powershell_compatibility: parsed.powershell_compatibility,
    safety_score: parsed.safety_score ?? null,
    documentation_score: parsed.documentation_score ?? null,
    community_rating: parsed.community_rating ?? null,
    download_count: parsed.download_count ?? 0,
    source_type: "community",
    review_status: "pending_review",
    reviewed_by: null,
    reviewed_at: null,
    submitter: {
      name: parsed.submitter_name,
      email: parsed.submitter_email,
      organization: parsed.submitter_organization,
    },
    license: parsed.license,
    attribution_required: parsed.attribution_required,
  });

  const result = await getScriptStorage(rootDir).createPendingCommunity({
    submission,
    scriptBody: submission.script_body,
    scriptExtension: parsed.script_extension,
  });

  await logScriptAuditEvent({
    type: "submission_created",
    submission,
    actor: submission.submitter.email,
    rootDir,
  });
  await logScriptAuditEvent({
    type: "safety_scan_completed",
    submission,
    actor: submission.submitter.email,
    notes: `Risk level: ${submission.safety.risk_level}`,
    rootDir,
  });

  return result;
}
