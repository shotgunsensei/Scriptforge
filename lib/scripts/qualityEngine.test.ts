import { describe, expect, it } from "vitest";
import type { ModernizationFeatureMap } from "./modernization";
import { scoreScriptQuality } from "./qualityEngine";
import type { ScriptSubmission } from "./schema";

const baseSubmission: ScriptSubmission = {
  title: "Security Audit Baseline",
  slug: "security-audit-baseline",
  version: "1.0.0",
  category: "security",
  tags: ["security", "audit"],
  author: { name: "OperatorOS ScriptForge" },
  summary: "Collects security posture data for technician and customer review.",
  description: "Collects security posture data with evidence, reporting, dependency validation, and operator summary output for MSP review workflows.",
  use_case: "Use during recurring MSP security audits, customer onboarding, and incident response readiness reviews.",
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
  requirements: [{ name: "PowerShell 7", required: true }],
  parameters: [{ name: "OutputPath", type: "path", description: "Report output folder.", required: false, sensitive: false }],
  examples: [{ title: "Run audit", command: "./security-audit-baseline.ps1 -DryRun" }],
  output: { format: "json", description: "HTML, CSV, and JSON report artifacts." },
  script_body: "Get-Process",
  documentation: { changelog: "1.0.0 - Initial release.", references: ["https://learn.microsoft.com/powershell/"] },
  monetization: { tier: "operator", entitlement_required: true },
  source_type: "operatoros",
  review_status: "approved",
  reviewed_by: "OperatorOS",
  reviewed_at: "2026-06-05T12:00:00.000Z",
  submitter: { name: "OperatorOS", email: "scripts@operatoros.net" },
  license: "Proprietary",
  attribution_required: false,
};

const allFeatures: ModernizationFeatureMap = {
  frameworkImport: true,
  cmdletBinding: true,
  structuredLogging: true,
  tryCatch: true,
  whatIf: true,
  dryRun: true,
  rollback: true,
  htmlReport: true,
  csvExport: true,
  jsonExport: true,
  operatorSummary: true,
  riskScoring: true,
  healthScoring: true,
  executionTiming: true,
  exceptionTracking: true,
  permissionValidation: true,
  powershellVersionValidation: true,
  moduleDependencyValidation: true,
  tenantCollection: true,
  machineCollection: true,
  evidenceCollection: true,
};

describe("script quality engine", () => {
  it("certifies fully mature scripts as OperatorOS certified", () => {
    const quality = scoreScriptQuality({
      submission: { ...baseSubmission, last_tested: "2026-06-05T12:00:00.000Z", powershell_compatibility: ["7.4"] },
      scriptBody: "[CmdletBinding(SupportsShouldProcess = $true)] param([switch] $DryRun) Assert-OperatorOSPermission; Export-OperatorOSReport; Describe 'script tests' { It 'runs' { } }",
      features: allFeatures,
    });

    expect(quality.certificationLevel).toBe("Level 5: OperatorOS Certified");
    expect(quality.productionReadinessScore).toBeGreaterThanOrEqual(90);
    expect(quality.certificationGate.operatorOsCertifiedEligible).toBe(true);
  });

  it("keeps basic framework imports at technician-ready level", () => {
    const quality = scoreScriptQuality({
      submission: baseSubmission,
      scriptBody: "Import-Module OperatorOS-ScriptFramework.psm1\nGet-Process",
      features: { ...allFeatures, cmdletBinding: false, structuredLogging: false, tryCatch: false, whatIf: false, dryRun: false, rollback: false, htmlReport: false, csvExport: false, jsonExport: false, operatorSummary: false, riskScoring: false, healthScoring: false, executionTiming: false, exceptionTracking: false, permissionValidation: false, powershellVersionValidation: false, moduleDependencyValidation: false, tenantCollection: false, machineCollection: false, evidenceCollection: false },
    });

    expect(quality.certificationLevel).toBe("Level 2: Technician Ready");
    expect(quality.rewriteRecommendation).toContain("Enhance");
    expect(quality.certificationGate.operatorOsCertifiedEligible).toBe(false);
  });
});
