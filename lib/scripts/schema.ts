import { z } from "zod";
import { isValidScriptSlug } from "./slug";

export const scriptSourceTypeSchema = z.enum(["official", "community", "operatoros"]);

export const scriptReviewStatusSchema = z.enum([
  "draft",
  "trusted_draft",
  "pending_review",
  "needs_changes",
  "approved",
  "rejected",
  "published",
  "archived",
]);

export const scriptSafetyLevelSchema = z.enum(["low", "medium", "high", "critical"]);

export const scriptRiskFlagSchema = z.enum([
  "destructive_filesystem",
  "credential_access",
  "download_execute",
  "encoded_command",
  "obfuscation",
  "persistence",
  "privilege_escalation",
  "remote_network",
  "registry_change",
  "service_change",
  "firewall_change",
  "scheduled_task",
  "policy_change",
]);

export const scriptParameterTypeSchema = z.enum([
  "string",
  "number",
  "boolean",
  "choice",
  "path",
  "credential",
  "array",
]);

const nonEmptyString = z.string().trim().min(1);

const isoDateTimeString = z
  .string()
  .datetime({ offset: true })
  .describe("ISO 8601 timestamp with timezone offset.");

export const scriptAuthorSchema = z.object({
  name: nonEmptyString.max(120),
  email: z.string().email().optional(),
  organization: z.string().trim().max(120).optional(),
  url: z.string().url().optional(),
});

export const scriptSubmitterSchema = z.object({
  user_id: z.string().trim().max(120).optional(),
  name: nonEmptyString.max(120),
  email: z.string().email(),
  organization: z.string().trim().max(120).optional(),
  tenant_id: z.string().trim().max(120).optional(),
});

export const scriptSafetySchema = z.object({
  risk_level: scriptSafetyLevelSchema,
  scan_required: z.literal(true),
  scan_status: z.enum(["not_scanned", "passed", "warnings", "failed"]),
  risk_flags: z.array(scriptRiskFlagSchema).default([]),
  requires_admin: z.boolean().default(false),
  touches_network: z.boolean().default(false),
  touches_registry: z.boolean().default(false),
  touches_filesystem: z.boolean().default(false),
  notes: z.string().trim().max(2000).optional(),
});

export const scriptRequirementSchema = z.object({
  name: nonEmptyString.max(120),
  description: z.string().trim().max(500).optional(),
  required: z.boolean().default(true),
});

export const scriptParameterSchema = z.object({
  name: nonEmptyString.max(80),
  type: scriptParameterTypeSchema,
  description: z.string().trim().max(500).optional(),
  required: z.boolean().default(false),
  default: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional(),
  choices: z.array(nonEmptyString.max(120)).optional(),
  sensitive: z.boolean().default(false),
});

export const scriptExampleSchema = z.object({
  title: nonEmptyString.max(120),
  command: nonEmptyString.max(2000),
  description: z.string().trim().max(1000).optional(),
});

export const scriptOutputSchema = z.object({
  format: z.enum(["text", "json", "csv", "html", "none"]),
  description: z.string().trim().max(1000).optional(),
  sample: z.string().trim().max(4000).optional(),
});

export const scriptDocumentationSchema = z.object({
  readme: z.string().trim().max(20000).optional(),
  changelog: z.string().trim().max(10000).optional(),
  references: z.array(z.string().url()).default([]),
});

export const scriptMonetizationSchema = z.object({
  tier: z.enum(["free", "starter", "pro", "business", "operator", "elite", "addon"]),
  addon_key: z.string().trim().max(120).optional(),
  entitlement_required: z.boolean().default(false),
  upgrade_cta: z.string().trim().max(240).optional(),
});

export const scriptSubmissionSchema = z
  .object({
    title: nonEmptyString.max(120),
    slug: z
      .string()
      .trim()
      .min(3)
      .max(80)
      .refine(isValidScriptSlug, "Slug must use lowercase letters, numbers, and hyphens only."),
    version: z.string().trim().regex(/^\d+\.\d+\.\d+$/, "Version must use semver format."),
    category: nonEmptyString.max(80),
    subcategory: z.string().trim().max(80).optional(),
    tags: z.array(nonEmptyString.max(40)).max(20).default([]),
    author: scriptAuthorSchema,
    summary: nonEmptyString.max(240),
    description: nonEmptyString.max(5000),
    use_case: nonEmptyString.max(2000),
    safety: scriptSafetySchema,
    requirements: z.array(scriptRequirementSchema).default([]),
    parameters: z.array(scriptParameterSchema).default([]),
    examples: z.array(scriptExampleSchema).default([]),
    output: scriptOutputSchema,
    script_body: nonEmptyString.max(200000),
    documentation: scriptDocumentationSchema,
    monetization: scriptMonetizationSchema,
    source_type: scriptSourceTypeSchema,
    review_status: scriptReviewStatusSchema,
    reviewed_by: z.string().trim().max(120).nullable().default(null),
    reviewed_at: isoDateTimeString.nullable().default(null),
    submitter: scriptSubmitterSchema,
    license: nonEmptyString.max(120),
    attribution_required: z.boolean(),
  })
  .superRefine((submission, ctx) => {
    if (
      submission.source_type === "community" &&
      submission.review_status === "approved" &&
      (!submission.reviewed_by || !submission.reviewed_at)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["review_status"],
        message: "Community approvals require reviewer identity and timestamp.",
      });
    }

    if (submission.source_type === "community" && submission.review_status === "published") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["review_status"],
        message: "Community submissions must be reviewed before publication.",
      });
    }

    if (submission.review_status === "pending_review" && submission.reviewed_by) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reviewed_by"],
        message: "Pending submissions must not include reviewer identity.",
      });
    }

    if (submission.review_status === "pending_review" && submission.reviewed_at) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reviewed_at"],
        message: "Pending submissions must not include a review timestamp.",
      });
    }

    if (submission.safety.scan_required !== true) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["safety", "scan_required"],
        message: "PowerShell submissions must require safety scanning.",
      });
    }
  });

export type ScriptSourceType = z.infer<typeof scriptSourceTypeSchema>;
export type ScriptReviewStatus = z.infer<typeof scriptReviewStatusSchema>;
export type ScriptSafetyLevel = z.infer<typeof scriptSafetyLevelSchema>;
export type ScriptSubmission = z.infer<typeof scriptSubmissionSchema>;

export function parseScriptSubmission(input: unknown): ScriptSubmission {
  return scriptSubmissionSchema.parse(input);
}

export function validateScriptSubmission(input: unknown) {
  return scriptSubmissionSchema.safeParse(input);
}
