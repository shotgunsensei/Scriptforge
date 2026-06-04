import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getBlankCommunityTemplate,
  saveCommunityScriptSubmission,
  validateCommunityUploadFile,
  type CommunityScriptSubmissionInput,
} from "./community-submit";

const baseInput: CommunityScriptSubmissionInput = {
  title: "Restart Print Spooler",
  version: "1.0.0",
  category: "Endpoint Tools",
  subcategory: "Services",
  tags: ["powershell", "windows", "services"],
  author_name: "Community Technician",
  author_email: "tech@example.com",
  author_organization: "Example MSP",
  summary: "Restarts the local Windows print spooler service.",
  description: "A community-submitted helper for print spooler troubleshooting.",
  use_case: "Use when validating basic print spooler recovery steps.",
  requirements: ["PowerShell 5.1 or newer"],
  parameters: [],
  examples: ["./Restart-PrintSpooler.ps1"],
  output_format: "text",
  output_description: "Service restart status.",
  script_body: "Restart-Service -Name Spooler",
  script_extension: ".ps1",
  documentation_readme: "Pending review before public use.",
  documentation_changelog: "1.0.0 - Initial submission.",
  monetization_tier: "free",
  entitlement_required: false,
  submitter_name: "Community Technician",
  submitter_email: "tech@example.com",
  submitter_organization: "Example MSP",
  license: "MIT",
  attribution_required: true,
};

describe("community script submission", () => {
  it("saves public submissions as community pending review", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-community-"));

    try {
      const result = await saveCommunityScriptSubmission(baseInput, rootDir);

      expect(result.submission.source_type).toBe("community");
      expect(result.submission.review_status).toBe("pending_review");
      expect(result.submission.reviewed_by).toBeNull();
      expect(result.folderPath).toContain(join("content", "pending-community-scripts", "restart-print-spooler"));
      await expect(readFile(result.files.script, "utf8")).resolves.toContain("Restart-Service");
      await expect(readFile(result.files.metadata, "utf8")).resolves.toContain('"review_status": "pending_review"');
      await expect(readFile(result.files.readme, "utf8")).resolves.toContain("Auto-approved: no");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("preserves .psm1 uploads as module files", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-community-"));

    try {
      const result = await saveCommunityScriptSubmission(
        {
          ...baseInput,
          script_extension: ".psm1",
        },
        rootDir,
      );

      expect(result.files.script.endsWith("restart-print-spooler.psm1")).toBe(true);
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("enforces community upload extension and size limits", () => {
    expect(validateCommunityUploadFile("script.ps1", 1024, 250)).toBe(".ps1");
    expect(validateCommunityUploadFile("metadata.yaml", 1024, 250)).toBe(".yaml");
    expect(() => validateCommunityUploadFile("script.exe", 1024, 250)).toThrow("Unsupported upload extension");
    expect(() => validateCommunityUploadFile("script.ps1", 251 * 1024, 250)).toThrow("Upload exceeds 250 KB");
  });

  it("generates blank templates locked to community pending review", () => {
    const template = getBlankCommunityTemplate();

    expect(template.source_type).toBe("community");
    expect(template.review_status).toBe("pending_review");
    expect(template.safety.scan_required).toBe(true);
  });
});
