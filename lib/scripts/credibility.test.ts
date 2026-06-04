import { describe, expect, it } from "vitest";
import { deriveDocumentationScore, deriveSafetyScore, deriveScriptCredibility } from "./credibility";
import type { ScriptSubmission } from "./schema";

const submission: ScriptSubmission = {
  title: "Collect Inventory",
  slug: "collect-inventory",
  version: "1.0.0",
  category: "endpoint",
  tags: ["inventory"],
  author: {
    name: "OperatorOS",
  },
  summary: "Collects endpoint inventory for technician review.",
  description: "Collects endpoint inventory for technician review with structured output and a documented workflow.",
  use_case: "Use during endpoint triage before deeper troubleshooting.",
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
  requirements: [{ name: "PowerShell 5.1", required: true }],
  parameters: [],
  examples: [{ title: "Run", command: ".\\collect.ps1" }],
  output: {
    format: "json",
  },
  script_body: "Get-ComputerInfo",
  documentation: {
    readme: "Run from a technician console.",
    changelog: "1.0.0 - Initial release.",
    references: [],
  },
  monetization: {
    tier: "free",
    entitlement_required: false,
  },
  github_repo_url: null,
  github_file_url: null,
  github_commit_sha: null,
  github_last_synced_at: null,
  last_tested_at: null,
  powershell_compatibility: ["Windows PowerShell 5.1", "PowerShell 7"],
  safety_score: null,
  documentation_score: null,
  community_rating: null,
  download_count: 0,
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

describe("script credibility", () => {
  it("derives safety and documentation scores from script metadata", () => {
    expect(deriveSafetyScore(submission)).toBe(100);
    expect(deriveDocumentationScore(submission)).toBe(100);
  });

  it("uses explicit credibility fields when supplied", () => {
    const credibility = deriveScriptCredibility({
      ...submission,
      safety_score: 92,
      documentation_score: 86,
      community_rating: 4.5,
      download_count: 42,
      last_tested_at: "2026-06-02T00:00:00.000Z",
    });

    expect(credibility).toMatchObject({
      safety_score: 92,
      documentation_score: 86,
      community_rating: 4.5,
      download_count: 42,
      last_tested: "2026-06-02T00:00:00.000Z",
    });
  });
});
