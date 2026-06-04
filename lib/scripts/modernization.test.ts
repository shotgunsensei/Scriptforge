import { describe, expect, it } from "vitest";
import { addFrameworkBootstrap } from "../../scripts/apply-script-framework";
import type { ScriptSubmission } from "./schema";
import { assessOfficialScript } from "./modernization";

const submission: ScriptSubmission = {
  title: "Official Audit Script",
  slug: "official-audit-script",
  version: "1.0.0",
  category: "security",
  tags: ["operatoros", "audit"],
  author: {
    name: "OperatorOS ScriptForge",
  },
  summary: "Collects a security audit baseline for review.",
  description: "Official OperatorOS script used to collect security audit information with enterprise reporting and evidence capture.",
  use_case: "Use during MSP security reviews, client onboarding, and recurring audit workflows.",
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
  requirements: [
    {
      name: "PowerShell 7",
      required: true,
    },
  ],
  parameters: [],
  examples: [
    {
      title: "Run audit",
      command: "./official-audit-script.ps1 -DryRun",
    },
  ],
  output: {
    format: "json",
  },
  script_body: "Get-Process",
  documentation: {
    changelog: "1.0.0 - Initial version.",
    references: [],
  },
  monetization: {
    tier: "operator",
    entitlement_required: true,
  },
  source_type: "operatoros",
  review_status: "approved",
  reviewed_by: "OperatorOS",
  reviewed_at: "2026-06-04T12:00:00.000Z",
  submitter: {
    name: "OperatorOS",
    email: "scripts@operatoros.net",
  },
  license: "Proprietary",
  attribution_required: false,
};

describe("official script modernization", () => {
  it("adds the framework bootstrap after header comments", () => {
    const updated = addFrameworkBootstrap("# Header\n\n$ErrorActionPreference = 'Stop'\nGet-Process\n");

    expect(updated).toContain("OperatorOS-ScriptFramework.psm1");
    expect(updated.indexOf("OperatorOS-ScriptFramework.psm1")).toBeLessThan(updated.indexOf("$ErrorActionPreference"));
  });

  it("marks basic generated scripts as rewrite candidates", () => {
    const assessment = assessOfficialScript({
      submission,
      scriptBody: "# basic\nGet-Process\n",
      scriptPath: "content/scripts/operatoros/security/official-audit-script/official-audit-script.ps1",
    });

    expect(assessment.maturity).toBe("rewrite");
    expect(assessment.requiredActions).toContain("Imports OperatorOS framework");
  });

  it("recognizes enterprise framework capabilities", () => {
    const scriptBody = `
[CmdletBinding(SupportsShouldProcess = $true)]
param([switch] $DryRun)
Import-Module .\\OperatorOS-ScriptFramework.psm1
$Context = New-OperatorOSExecutionContext -ScriptName "Official Audit Script" -SafetyMode Audit -DryRun:$DryRun
try {
  Assert-OperatorOSPowerShellVersion -MinimumVersion "7.0"
  Assert-OperatorOSModuleDependency -ModuleName @("Microsoft.Graph.Users")
  Assert-OperatorOSPermission -PermissionName "Graph Reader" -ValidationScript { $true }
  Get-OperatorOSTenantInfo
  Get-OperatorOSMachineInfo
  Add-OperatorOSEvidence -Context $Context -Name "Sample" -Value 1
  Invoke-OperatorOSOperation -Context $Context -Name "Audit" -Operation { Get-Process } -Rollback { Write-OperatorOSLog -Context $Context -Level Info -Message "Rollback" } -WhatIf:$WhatIfPreference
  Export-OperatorOSReport -Context $Context -Data @() -Format Html,Csv,Json
  Get-OperatorOSRiskScore -SafetyMode Audit
  Get-OperatorOSHealthScore
  Complete-OperatorOSExecution -Context $Context
} catch {
  Add-OperatorOSException -Context $Context -Exception $_.Exception -Operation "Audit"
}
`;
    const assessment = assessOfficialScript({
      submission,
      scriptBody,
      scriptPath: "content/scripts/operatoros/security/official-audit-script/official-audit-script.ps1",
    });

    expect(assessment.maturity).toBe("acceptable");
    expect(assessment.qualityScore).toBeGreaterThanOrEqual(90);
  });
});
