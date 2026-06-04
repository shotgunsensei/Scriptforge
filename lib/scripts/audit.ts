import { getScriptStorage } from "./storage";
import type { ScriptAuditEventType } from "./storage/types";
import type { ScriptSubmission } from "./schema";

export async function logScriptAuditEvent({
  type,
  submission,
  actor,
  notes,
  rootDir,
}: {
  type: ScriptAuditEventType;
  submission: ScriptSubmission;
  actor?: string | null;
  notes?: string;
  rootDir?: string;
}) {
  await getScriptStorage(rootDir).appendAuditEvent({
    type,
    slug: submission.slug,
    sourceType: submission.source_type,
    reviewStatus: submission.review_status,
    actor,
    notes,
    createdAt: new Date().toISOString(),
  });
}

export async function createScriptVersionSnapshot({
  submission,
  scriptBody,
  actor,
  rootDir,
}: {
  submission: ScriptSubmission;
  scriptBody: string;
  actor?: string | null;
  rootDir?: string;
}) {
  await getScriptStorage(rootDir).appendVersionSnapshot({
    slug: submission.slug,
    sourceType: submission.source_type,
    version: submission.version,
    scriptBody,
    metadata: submission,
    createdBy: actor,
    createdAt: new Date().toISOString(),
  });
}
