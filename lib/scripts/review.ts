import { access, mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { z } from "zod";
import { createScriptVersionSnapshot, logScriptAuditEvent } from "./audit";
import { scanPowerShellSafety } from "./safety-scan";
import { scriptSubmissionSchema, type ScriptSubmission } from "./schema";
import { createScriptSlug } from "./slug";
import { writeScriptIndex } from "./indexer";

const SCRIPT_EXTENSIONS = [".ps1", ".psm1"] as const;

export const reviewUpdateSchema = z.object({
  slug: z.string().trim().min(3).max(80),
  reviewed_by: z.string().trim().min(1).max(120).optional(),
  reviewer_notes: z.string().trim().max(5000).optional(),
  metadata: z
    .object({
      title: z.string().trim().min(1).max(120).optional(),
      version: z.string().trim().regex(/^\d+\.\d+\.\d+$/).optional(),
      category: z.string().trim().min(1).max(80).optional(),
      subcategory: z.string().trim().max(80).optional(),
      tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
      summary: z.string().trim().min(1).max(240).optional(),
      description: z.string().trim().min(1).max(5000).optional(),
      use_case: z.string().trim().min(1).max(2000).optional(),
      license: z.string().trim().min(1).max(120).optional(),
      attribution_required: z.boolean().optional(),
    })
    .optional(),
  script_body: z.string().trim().min(1).max(200000).optional(),
});

export type ReviewUpdateInput = z.infer<typeof reviewUpdateSchema>;

export type PendingReviewScript = {
  slug: string;
  folderPath: string;
  scriptPath: string;
  metadataPath: string;
  readmePath: string;
  scriptBody: string;
  submission: ScriptSubmission;
  approvedVersion?: {
    source: "community" | "operatoros";
    scriptBody: string;
    submission: ScriptSubmission;
    scriptBodyChanged: boolean;
    metadataChanged: boolean;
  };
};

export async function listPendingCommunityScripts(rootDir = process.cwd()): Promise<PendingReviewScript[]> {
  const baseDir = getPendingCommunityDir(rootDir);
  const folders = await readDirectorySafe(baseDir);
  const scripts = await Promise.all(
    folders.map(async (folder) => {
      try {
        return await readPendingCommunityScript(folder, rootDir);
      } catch {
        return null;
      }
    }),
  );

  return scripts
    .filter((script): script is PendingReviewScript => script !== null)
    .sort((left, right) => left.submission.title.localeCompare(right.submission.title));
}

export async function readPendingCommunityScript(slug: string, rootDir = process.cwd()): Promise<PendingReviewScript> {
  const safeSlug = createScriptSlug(slug);
  const folderPath = join(getPendingCommunityDir(rootDir), safeSlug);
  const metadataPath = join(folderPath, `${safeSlug}.json`);
  const submission = scriptSubmissionSchema.parse(JSON.parse(await readFile(metadataPath, "utf8")));
  const scriptPath = await findScriptPath(folderPath, safeSlug);
  const scriptBody = await readFile(scriptPath, "utf8");
  const approvedVersion = await findApprovedVersion(submission, scriptBody, rootDir);

  return {
    slug: safeSlug,
    folderPath,
    scriptPath,
    metadataPath,
    readmePath: join(folderPath, "README.md"),
    scriptBody,
    submission,
    approvedVersion,
  };
}

export async function updatePendingCommunityScript(
  input: ReviewUpdateInput,
  rootDir = process.cwd(),
): Promise<PendingReviewScript> {
  const parsed = reviewUpdateSchema.parse(input);
  const current = await readPendingCommunityScript(parsed.slug, rootDir);
  const scriptBody = parsed.script_body ?? current.scriptBody;
  const metadata = parsed.metadata ?? {};
  const category = metadata.category ? createScriptSlug(metadata.category) : current.submission.category;

  const updated = scriptSubmissionSchema.parse({
    ...current.submission,
    ...metadata,
    category,
    script_body: scriptBody,
    safety: scanPowerShellSafety(scriptBody),
    source_type: "community",
    review_status: current.submission.review_status,
    reviewed_by: current.submission.reviewed_by,
    reviewed_at: current.submission.reviewed_at,
    documentation: {
      ...current.submission.documentation,
      readme: current.submission.documentation.readme,
    },
  });

  await writePendingScriptFiles(current, updated, scriptBody);
  await logScriptAuditEvent({
    type: "script_updated",
    submission: updated,
    actor: parsed.reviewed_by ?? updated.reviewed_by,
    notes: parsed.reviewer_notes,
    rootDir,
  });
  await createScriptVersionSnapshot({
    submission: updated,
    scriptBody,
    actor: parsed.reviewed_by ?? updated.reviewed_by,
    rootDir,
  });

  return readPendingCommunityScript(current.slug, rootDir);
}

export async function approveCommunityScript(input: ReviewUpdateInput, rootDir = process.cwd()) {
  const updated = await updatePendingCommunityScript(input, rootDir);
  const reviewer = input.reviewed_by ?? "OperatorOS Admin";
  const approved = scriptSubmissionSchema.parse({
    ...updated.submission,
    source_type: "community",
    review_status: "approved",
    reviewed_by: reviewer,
    reviewed_at: new Date().toISOString(),
  });

  const result = await moveReviewedScript(updated, approved, join(rootDir, "content", "scripts", "community"));
  await logScriptAuditEvent({
    type: "script_approved",
    submission: approved,
    actor: reviewer,
    notes: input.reviewer_notes,
    rootDir,
  });
  await createScriptVersionSnapshot({
    submission: approved,
    scriptBody: updated.scriptBody,
    actor: reviewer,
    rootDir,
  });
  await writeScriptIndex(rootDir);

  return result;
}

export async function rejectCommunityScript(input: ReviewUpdateInput, rootDir = process.cwd()) {
  return markPendingCommunityStatus(input, "rejected", rootDir);
}

export async function markCommunityNeedsChanges(input: ReviewUpdateInput, rootDir = process.cwd()) {
  return markPendingCommunityStatus(input, "needs_changes", rootDir);
}

export async function promoteCommunityScript(input: ReviewUpdateInput, rootDir = process.cwd()) {
  const updated = await updatePendingCommunityScript(input, rootDir);
  const reviewer = input.reviewed_by ?? "OperatorOS Admin";
  const promoted = scriptSubmissionSchema.parse({
    ...updated.submission,
    source_type: "operatoros",
    review_status: "approved",
    reviewed_by: reviewer,
    reviewed_at: new Date().toISOString(),
  });

  const result = await moveReviewedScript(updated, promoted, join(rootDir, "content", "scripts", "operatoros"));
  await logScriptAuditEvent({
    type: "script_promoted_to_official",
    submission: promoted,
    actor: reviewer,
    notes: input.reviewer_notes,
    rootDir,
  });
  await createScriptVersionSnapshot({
    submission: promoted,
    scriptBody: updated.scriptBody,
    actor: reviewer,
    rootDir,
  });
  await writeScriptIndex(rootDir);

  return result;
}

async function markPendingCommunityStatus(
  input: ReviewUpdateInput,
  reviewStatus: "rejected" | "needs_changes",
  rootDir: string,
) {
  const updated = await updatePendingCommunityScript(input, rootDir);
  const reviewed = scriptSubmissionSchema.parse({
    ...updated.submission,
    review_status: reviewStatus,
    reviewed_by: input.reviewed_by ?? "OperatorOS Admin",
    reviewed_at: new Date().toISOString(),
    documentation: {
      ...updated.submission.documentation,
      changelog: appendReviewNote(updated.submission.documentation.changelog, reviewStatus, input.reviewer_notes),
    },
  });

  await writePendingScriptFiles(updated, reviewed, updated.scriptBody);
  await logScriptAuditEvent({
    type: reviewStatus === "rejected" ? "script_rejected" : "script_marked_needs_changes",
    submission: reviewed,
    actor: reviewed.reviewed_by,
    notes: input.reviewer_notes,
    rootDir,
  });

  return readPendingCommunityScript(updated.slug, rootDir);
}

async function findApprovedVersion(
  pending: ScriptSubmission,
  pendingScriptBody: string,
  rootDir: string,
): Promise<PendingReviewScript["approvedVersion"]> {
  const candidates = [
    { source: "community" as const, folder: join(rootDir, "content", "scripts", "community", pending.category, pending.slug) },
    { source: "operatoros" as const, folder: join(rootDir, "content", "scripts", "operatoros", pending.category, pending.slug) },
  ];

  for (const candidate of candidates) {
    try {
      const metadataPath = join(candidate.folder, `${pending.slug}.json`);
      const approvedSubmission = scriptSubmissionSchema.parse(JSON.parse(await readFile(metadataPath, "utf8")));
      const approvedScriptPath = await findScriptPath(candidate.folder, pending.slug);
      const approvedScriptBody = await readFile(approvedScriptPath, "utf8");

      return {
        source: candidate.source,
        submission: approvedSubmission,
        scriptBody: approvedScriptBody,
        scriptBodyChanged: normalizeScript(approvedScriptBody) !== normalizeScript(pendingScriptBody),
        metadataChanged: JSON.stringify(stripVolatileReviewFields(approvedSubmission)) !== JSON.stringify(stripVolatileReviewFields(pending)),
      };
    } catch {
      continue;
    }
  }

  return undefined;
}

function normalizeScript(scriptBody: string): string {
  return scriptBody.trim().replace(/\r\n/g, "\n");
}

function stripVolatileReviewFields(submission: ScriptSubmission): Partial<ScriptSubmission> {
  const { reviewed_at, reviewed_by, review_status, safety, ...stable } = submission;

  return stable;
}

async function moveReviewedScript(
  current: PendingReviewScript,
  submission: ScriptSubmission,
  catalogRoot: string,
) {
  const destinationFolder = join(catalogRoot, submission.category, submission.slug);
  await assertPathDoesNotExist(destinationFolder);
  await writePendingScriptFiles(current, submission, current.scriptBody);
  await mkdir(join(catalogRoot, submission.category), { recursive: true });
  await rename(current.folderPath, destinationFolder);

  return {
    submission,
    folderPath: destinationFolder,
    files: {
      script: join(destinationFolder, `${submission.slug}${extname(current.scriptPath)}`),
      metadata: join(destinationFolder, `${submission.slug}.json`),
      readme: join(destinationFolder, "README.md"),
    },
  };
}

async function writePendingScriptFiles(
  current: PendingReviewScript,
  submission: ScriptSubmission,
  scriptBody: string,
) {
  await writeFile(current.scriptPath, `${scriptBody.trim()}\n`, "utf8");
  await writeFile(current.metadataPath, `${JSON.stringify(submission, null, 2)}\n`, "utf8");
  await writeFile(current.readmePath, buildReviewReadme(submission), "utf8");
}

async function findScriptPath(folderPath: string, slug: string): Promise<string> {
  const files = await readdir(folderPath);
  const scriptFile = files.find((file) => {
    const extension = extname(file).toLowerCase();

    return file.startsWith(slug) && SCRIPT_EXTENSIONS.includes(extension as (typeof SCRIPT_EXTENSIONS)[number]);
  });

  if (!scriptFile) {
    throw new Error(`No script body file found for ${slug}.`);
  }

  return join(folderPath, scriptFile);
}

async function readDirectorySafe(path: string): Promise<string[]> {
  try {
    return await readdir(path);
  } catch {
    return [];
  }
}

async function assertPathDoesNotExist(path: string) {
  try {
    await access(path);
  } catch {
    return;
  }

  throw new Error(`Destination already exists: ${path}`);
}

function getPendingCommunityDir(rootDir: string): string {
  return join(rootDir, "content", "pending-community-scripts");
}

function appendReviewNote(existing: string | undefined, status: string, note: string | undefined): string {
  const stamp = new Date().toISOString();
  const entry = `${stamp} - Marked ${status}${note ? `: ${note}` : "."}`;

  return [existing, entry].filter(Boolean).join("\n");
}

function buildReviewReadme(submission: ScriptSubmission): string {
  const safetyFlags =
    submission.safety.risk_flags.length > 0 ? submission.safety.risk_flags.join(", ") : "none";

  return `# ${submission.title}

${submission.summary}

## Review

- Source type: ${submission.source_type}
- Review status: ${submission.review_status}
- Reviewed by: ${submission.reviewed_by ?? "not reviewed"}
- Reviewed at: ${submission.reviewed_at ?? "not reviewed"}

## Safety

- Risk level: ${submission.safety.risk_level}
- Scan status: ${submission.safety.scan_status}
- Risk flags: ${safetyFlags}

${submission.safety.notes ?? ""}

## Use Case

${submission.use_case}

## Description

${submission.description}

## License

${submission.license}${submission.attribution_required ? " - attribution required" : ""}
`;
}
