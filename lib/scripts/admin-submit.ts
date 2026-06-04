import { z } from "zod";
import { createScriptVersionSnapshot, logScriptAuditEvent } from "./audit";
import { createScriptSlug } from "./slug";
import { scanPowerShellSafety } from "./safety-scan";
import { scriptSubmissionSchema, type ScriptSubmission } from "./schema";
import { getScriptStorage } from "./storage";

export const adminSubmissionStatusSchema = z.enum(["trusted_draft", "approved"]);

export const adminScriptSubmissionInputSchema = z.object({
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
  documentation_readme: z.string().trim().max(20000).optional(),
  documentation_changelog: z.string().trim().max(10000).optional(),
  monetization_tier: z.enum(["free", "starter", "pro", "business", "operator", "elite", "addon"]).default("free"),
  entitlement_required: z.boolean().default(false),
  addon_key: z.string().trim().max(120).optional(),
  review_status: adminSubmissionStatusSchema,
  reviewed_by: z.string().trim().min(1).max(120),
  submitter_name: z.string().trim().min(1).max(120),
  submitter_email: z.string().email(),
  submitter_organization: z.string().trim().max(120).optional(),
  license: z.string().trim().min(1).max(120),
  attribution_required: z.boolean().default(false),
});

export type AdminScriptSubmissionInput = z.infer<typeof adminScriptSubmissionInputSchema>;

export type SaveAdminScriptSubmissionResult = {
  submission: ScriptSubmission;
  folderPath: string;
  files: {
    script: string;
    metadata: string;
    readme: string;
  };
};

export async function saveAdminScriptSubmission(
  input: AdminScriptSubmissionInput,
  rootDir = process.cwd(),
): Promise<SaveAdminScriptSubmissionResult> {
  const parsed = adminScriptSubmissionInputSchema.parse(input);
  const slug = parsed.slug ? createScriptSlug(parsed.slug) : createScriptSlug(parsed.title);
  const category = createScriptSlug(parsed.category);

  const safety = scanPowerShellSafety(parsed.script_body);

  if (parsed.review_status === "approved" && safety.scan_status === "failed") {
    throw new Error("Approved scripts cannot be saved while the safety scan is failed.");
  }

  const now = new Date().toISOString();
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
    source_type: "operatoros",
    review_status: parsed.review_status,
    reviewed_by: parsed.reviewed_by,
    reviewed_at: now,
    submitter: {
      name: parsed.submitter_name,
      email: parsed.submitter_email,
      organization: parsed.submitter_organization,
    },
    license: parsed.license,
    attribution_required: parsed.attribution_required,
  });

  const storage = getScriptStorage(rootDir);
  const writeRecord = {
    submission,
    scriptBody: submission.script_body,
    scriptExtension: ".ps1" as const,
  };
  const result =
    parsed.review_status === "approved"
      ? await storage.saveOperatorOsApproved(writeRecord)
      : await storage.saveOperatorOsDraft(writeRecord);

  await logScriptAuditEvent({
    type: "submission_created",
    submission,
    actor: parsed.reviewed_by,
    rootDir,
  });
  await logScriptAuditEvent({
    type: "safety_scan_completed",
    submission,
    actor: parsed.reviewed_by,
    notes: `Risk level: ${submission.safety.risk_level}`,
    rootDir,
  });

  if (parsed.review_status === "approved") {
    await createScriptVersionSnapshot({
      submission,
      scriptBody: submission.script_body,
      actor: parsed.reviewed_by,
      rootDir,
    });
  }

  return result;
}
