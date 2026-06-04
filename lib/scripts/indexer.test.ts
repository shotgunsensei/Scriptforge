import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildScriptIndex, createScriptExcerpt, writeScriptIndex } from "./indexer";
import { saveCommunityScriptSubmission, type CommunityScriptSubmissionInput } from "./community-submit";
import { approveCommunityScript } from "./review";
import type { ScriptSubmission } from "./schema";

const approvedScript: ScriptSubmission = {
  title: "Collect Inventory",
  slug: "collect-inventory",
  version: "1.0.0",
  category: "endpoint",
  tags: ["inventory", "windows"],
  author: {
    name: "OperatorOS",
  },
  summary: "Collects endpoint inventory.",
  description: "Collects endpoint inventory for technician review.",
  use_case: "Use during endpoint triage.",
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
    format: "json",
  },
  script_body: "Get-ComputerInfo | ConvertTo-Json",
  documentation: {
    references: [],
  },
  monetization: {
    tier: "free",
    entitlement_required: false,
  },
  source_type: "operatoros",
  review_status: "approved",
  reviewed_by: "OperatorOS Admin",
  reviewed_at: "2026-06-04T12:00:00.000Z",
  submitter: {
    name: "OperatorOS Admin",
    email: "admin@operatoros.net",
  },
  license: "MIT",
  attribution_required: false,
};

const pendingCommunity: CommunityScriptSubmissionInput = {
  title: "Restart Spooler",
  version: "1.0.0",
  category: "Endpoint",
  tags: ["print", "windows"],
  author_name: "Community Tech",
  summary: "Restarts the print spooler.",
  description: "Restarts the local print spooler service.",
  use_case: "Use during print troubleshooting.",
  requirements: [],
  parameters: [],
  examples: [],
  output_format: "text",
  script_body: "Restart-Service -Name Spooler",
  script_extension: ".ps1",
  monetization_tier: "free",
  entitlement_required: false,
  submitter_name: "Community Tech",
  submitter_email: "tech@example.com",
  license: "MIT",
  attribution_required: false,
};

describe("script indexer", () => {
  it("builds searchable index entries from approved catalogs", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-index-"));

    try {
      await writeApprovedScript(rootDir, "operatoros", approvedScript);
      const index = await buildScriptIndex(rootDir);

      expect(index.count).toBe(1);
      expect(index.scripts[0]).toMatchObject({
        title: "Collect Inventory",
        summary: "Collects endpoint inventory.",
        description: "Collects endpoint inventory for technician review.",
        category: "endpoint",
        tags: ["inventory", "windows"],
        source_type: "operatoros",
        risk_level: "low",
        execution_type: "local",
        requires_admin: false,
        slug: "collect-inventory",
        path: "/scripts/operatoros/endpoint/collect-inventory",
      });
      expect(index.scripts[0].script_body_excerpt).toContain("Get-ComputerInfo");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("writes public script-index.json", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-index-"));

    try {
      await writeApprovedScript(rootDir, "operatoros", approvedScript);
      const { outputPath } = await writeScriptIndex(rootDir);
      const output = JSON.parse(await readFile(outputPath, "utf8"));

      expect(outputPath).toBe(join(rootDir, "public", "script-index.json"));
      expect(output.count).toBe(1);
      expect(output.scripts[0].path).toBe("/scripts/operatoros/endpoint/collect-inventory");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("rebuilds the public index after community approval", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-index-"));

    try {
      await saveCommunityScriptSubmission(pendingCommunity, rootDir);
      await approveCommunityScript({ slug: "restart-spooler", reviewed_by: "OperatorOS Admin" }, rootDir);
      const output = JSON.parse(await readFile(join(rootDir, "public", "script-index.json"), "utf8"));

      expect(output.count).toBe(1);
      expect(output.scripts[0]).toMatchObject({
        title: "Restart Spooler",
        source_type: "community",
        path: "/scripts/community/endpoint/restart-spooler",
      });
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("compacts script excerpts", () => {
    expect(createScriptExcerpt("Get-Process\n\n  | Select-Object Name")).toBe("Get-Process | Select-Object Name");
    expect(createScriptExcerpt("a".repeat(600))).toHaveLength(500);
  });
});

async function writeApprovedScript(
  rootDir: string,
  source: "operatoros" | "community",
  submission: ScriptSubmission,
) {
  const folder = join(rootDir, "content", "scripts", source, submission.category, submission.slug);
  await mkdir(folder, { recursive: true });
  await writeFile(join(folder, `${submission.slug}.json`), JSON.stringify(submission, null, 2), "utf8");
  await writeFile(join(folder, `${submission.slug}.ps1`), submission.script_body, "utf8");
}
