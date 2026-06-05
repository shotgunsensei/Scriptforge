import { describe, expect, it } from "vitest";
import { reviewOfficialScript } from "./enterpriseReview";
import type { ScriptSubmission } from "./schema";

const submission: ScriptSubmission = {
  title: "Mailbox Forwarding Audit",
  slug: "mailbox-forwarding-audit",
  version: "1.0.0",
  category: "exchange-online",
  tags: ["audit", "exchange"],
  author: { name: "OperatorOS ScriptForge" },
  summary: "Audits mailbox forwarding settings for production tenant review.",
  description: "Audits mailbox forwarding settings and produces evidence for production tenant security review.",
  use_case: "Use during Microsoft 365 security reviews and suspicious mail flow investigations.",
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
  requirements: [{ name: "ExchangeOnlineManagement", required: true }],
  parameters: [],
  examples: [{ title: "Run audit", command: "./mailbox-forwarding-audit.ps1" }],
  output: { format: "text", description: "Audit output." },
  script_body: "Get-Mailbox",
  documentation: { changelog: "1.0.0 - Initial.", references: [] },
  monetization: { tier: "operator", entitlement_required: true },
  source_type: "operatoros",
  review_status: "approved",
  reviewed_by: "OperatorOS",
  reviewed_at: "2026-06-05T12:00:00.000Z",
  submitter: { name: "OperatorOS", email: "scripts@operatoros.net" },
  license: "Proprietary",
  attribution_required: false,
};

describe("enterprise script review", () => {
  it("rejects placeholder-grade scripts with concrete findings", () => {
    const review = reviewOfficialScript({
      submission,
      scriptBody: "Get-Mailbox | Select-Object DisplayName,ForwardingAddress\n",
      scriptPath: "content/scripts/operatoros/exchange-online/mailbox-forwarding-audit/mailbox-forwarding-audit.ps1",
    });

    expect(review.rewritePriority).toBe(1);
    expect(review.qualityGateFailures.length).toBeGreaterThan(0);
    expect(review.findings.map((finding) => finding.message)).toContain("Missing advanced function CmdletBinding.");
    expect(review.findings.map((finding) => finding.message)).toContain("Missing HTML/CSV/JSON export support.");
  });
});
