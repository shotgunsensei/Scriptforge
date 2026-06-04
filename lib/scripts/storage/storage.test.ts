import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { ScriptSubmission } from "../schema";
import { getScriptStorage, getScriptStorageDriverName } from "./index";
import { LocalScriptStorage } from "./localStorage";

const originalStorageDriver = process.env.SCRIPT_STORAGE_DRIVER;
const originalDatabaseUrl = process.env.DATABASE_URL;

const submission: ScriptSubmission = {
  title: "Audit Local Services",
  slug: "audit-local-services",
  version: "1.0.0",
  category: "security",
  tags: ["audit"],
  author: {
    name: "OperatorOS ScriptForge",
  },
  summary: "Lists local services for review.",
  description: "Read-only service inventory script.",
  use_case: "Use during endpoint audit.",
  safety: {
    risk_level: "low",
    scan_required: true,
    scan_status: "passed",
    risk_flags: [],
    requires_admin: false,
    touches_network: false,
    touches_registry: false,
    touches_filesystem: false,
  },
  requirements: [],
  parameters: [],
  examples: [],
  output: {
    format: "text",
  },
  script_body: "Get-Service",
  documentation: {
    references: [],
  },
  monetization: {
    tier: "free",
    entitlement_required: false,
  },
  source_type: "community",
  review_status: "pending_review",
  reviewed_by: null,
  reviewed_at: null,
  submitter: {
    name: "Community Tech",
    email: "tech@example.com",
  },
  license: "MIT",
  attribution_required: false,
};

afterEach(() => {
  restoreEnv("SCRIPT_STORAGE_DRIVER", originalStorageDriver);
  restoreEnv("DATABASE_URL", originalDatabaseUrl);
});

describe("script storage adapters", () => {
  it("uses local storage by default and writes pending community records", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-storage-"));

    try {
      const result = await new LocalScriptStorage(rootDir).createPendingCommunity({
        submission,
        scriptBody: submission.script_body,
        scriptExtension: ".ps1",
      });

      expect(getScriptStorageDriverName()).toBe("local");
      expect(result.folderPath).toContain(join("content", "pending-community-scripts", submission.slug));
      await expect(readFile(result.files.script, "utf8")).resolves.toContain("Get-Service");
      await expect(readFile(result.files.readme, "utf8")).resolves.toContain("Auto-approved: no");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("stores audit events and version snapshots on the local driver", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-storage-"));
    const storage = new LocalScriptStorage(rootDir);

    try {
      await storage.appendAuditEvent({
        type: "submission_created",
        slug: submission.slug,
        sourceType: submission.source_type,
        reviewStatus: submission.review_status,
        actor: "tech@example.com",
        createdAt: "2026-06-04T12:00:00.000Z",
      });
      await storage.appendVersionSnapshot({
        slug: submission.slug,
        sourceType: submission.source_type,
        version: submission.version,
        scriptBody: submission.script_body,
        metadata: submission,
        createdBy: "tech@example.com",
        createdAt: "2026-06-04T12:00:01.000Z",
      });

      const auditFiles = await readdir(join(rootDir, "content", "audit-events"));
      const versionFiles = await readdir(join(rootDir, "content", "script-versions", "community", submission.slug));

      expect(auditFiles[0]).toContain("submission_created");
      expect(versionFiles[0]).toContain("1.0.0");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("fails closed when database storage is selected without DATABASE_URL", async () => {
    process.env.SCRIPT_STORAGE_DRIVER = "database";
    process.env.DATABASE_URL = "";

    await expect(
      getScriptStorage().createPendingCommunity({
        submission,
        scriptBody: submission.script_body,
        scriptExtension: ".ps1",
      }),
    ).rejects.toThrow("DATABASE_URL is required");
  });
});

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}
