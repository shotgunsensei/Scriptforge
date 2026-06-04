import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { saveCommunityScriptSubmission, type CommunityScriptSubmissionInput } from "./community-submit";
import {
  approveCommunityScript,
  listPendingCommunityScripts,
  markCommunityNeedsChanges,
  promoteCommunityScript,
  rejectCommunityScript,
  updatePendingCommunityScript,
} from "./review";

const baseInput: CommunityScriptSubmissionInput = {
  title: "Clear Temp Files",
  version: "1.0.0",
  category: "Endpoint Tools",
  tags: ["powershell", "cleanup"],
  author_name: "Community Tech",
  author_email: "tech@example.com",
  summary: "Lists temp files for cleanup review.",
  description: "Community script submitted for review.",
  use_case: "Use during endpoint cleanup triage.",
  requirements: ["PowerShell 5.1 or newer"],
  parameters: [],
  examples: ["./Clear-TempFiles.ps1"],
  output_format: "text",
  script_body: "Get-ChildItem $env:TEMP",
  script_extension: ".ps1",
  monetization_tier: "free",
  entitlement_required: false,
  submitter_name: "Community Tech",
  submitter_email: "tech@example.com",
  license: "MIT",
  attribution_required: false,
};

describe("admin script review", () => {
  it("lists pending community scripts with metadata and script body", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-review-"));

    try {
      await saveCommunityScriptSubmission(baseInput, rootDir);
      const queue = await listPendingCommunityScripts(rootDir);

      expect(queue).toHaveLength(1);
      expect(queue[0].submission.source_type).toBe("community");
      expect(queue[0].submission.review_status).toBe("pending_review");
      expect(queue[0].scriptBody).toContain("Get-ChildItem");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("updates metadata and rescans edited script body", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-review-"));

    try {
      await saveCommunityScriptSubmission(baseInput, rootDir);
      const updated = await updatePendingCommunityScript(
        {
          slug: "clear-temp-files",
          metadata: {
            title: "Clear Temporary Files",
            category: "Cleanup Tools",
          },
          script_body: "Remove-Item $env:TEMP\\*.tmp -Force",
        },
        rootDir,
      );

      expect(updated.submission.title).toBe("Clear Temporary Files");
      expect(updated.submission.category).toBe("cleanup-tools");
      expect(updated.submission.safety.risk_flags).toContain("destructive_filesystem");
      await expect(readFile(updated.metadataPath, "utf8")).resolves.toContain("Clear Temporary Files");

      const auditFiles = await readdir(join(rootDir, "content", "audit-events"));
      const versionFiles = await readdir(join(rootDir, "content", "script-versions", "community", "clear-temp-files"));
      expect(auditFiles.some((file) => file.includes("script_updated"))).toBe(true);
      expect(versionFiles.length).toBeGreaterThan(0);
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("approves community scripts into the community catalog", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-review-"));

    try {
      await saveCommunityScriptSubmission(baseInput, rootDir);
      const result = await approveCommunityScript(
        {
          slug: "clear-temp-files",
          reviewed_by: "OperatorOS Admin",
        },
        rootDir,
      );

      expect(result.submission.source_type).toBe("community");
      expect(result.submission.review_status).toBe("approved");
      expect(result.folderPath).toContain(join("content", "scripts", "community", "endpoint-tools", "clear-temp-files"));
      await expect(readFile(result.files.metadata, "utf8")).resolves.toContain('"review_status": "approved"');

      const auditFiles = await readdir(join(rootDir, "content", "audit-events"));
      const versionFiles = await readdir(join(rootDir, "content", "script-versions", "community", "clear-temp-files"));
      expect(auditFiles.some((file) => file.includes("script_approved"))).toBe(true);
      expect(versionFiles.length).toBeGreaterThan(0);
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("promotes community scripts into the OperatorOS catalog", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-review-"));

    try {
      await saveCommunityScriptSubmission(baseInput, rootDir);
      const result = await promoteCommunityScript(
        {
          slug: "clear-temp-files",
          reviewed_by: "OperatorOS Admin",
        },
        rootDir,
      );

      expect(result.submission.source_type).toBe("operatoros");
      expect(result.submission.review_status).toBe("approved");
      expect(result.folderPath).toContain(join("content", "scripts", "operatoros", "endpoint-tools", "clear-temp-files"));
      await expect(readFile(result.files.metadata, "utf8")).resolves.toContain('"source_type": "operatoros"');
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("marks pending scripts rejected or needs changes without moving them", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-review-"));

    try {
      await saveCommunityScriptSubmission(baseInput, rootDir);
      const needsChanges = await markCommunityNeedsChanges(
        {
          slug: "clear-temp-files",
          reviewed_by: "OperatorOS Admin",
          reviewer_notes: "Add dry-run mode.",
        },
        rootDir,
      );

      expect(needsChanges.folderPath).toContain(join("content", "pending-community-scripts", "clear-temp-files"));
      expect(needsChanges.submission.review_status).toBe("needs_changes");

      const rejected = await rejectCommunityScript(
        {
          slug: "clear-temp-files",
          reviewed_by: "OperatorOS Admin",
          reviewer_notes: "Rejected after second review.",
        },
        rootDir,
      );

      expect(rejected.submission.review_status).toBe("rejected");
      expect(rejected.folderPath).toContain(join("content", "pending-community-scripts", "clear-temp-files"));

      const auditFiles = await readdir(join(rootDir, "content", "audit-events"));
      expect(auditFiles.some((file) => file.includes("script_marked_needs_changes"))).toBe(true);
      expect(auditFiles.some((file) => file.includes("script_rejected"))).toBe(true);
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });
});
