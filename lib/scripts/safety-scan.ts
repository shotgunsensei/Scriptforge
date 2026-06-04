import type { z } from "zod";
import { scriptRiskFlagSchema, type ScriptSafetyLevel } from "./schema";
import { scanPowerShellScript, type SafetyScannerPatternId } from "./safetyScanner";

type ScriptRiskFlag = z.infer<typeof scriptRiskFlagSchema>;

export type ScriptSafetyScanResult = {
  risk_level: ScriptSafetyLevel;
  scan_required: true;
  scan_status: "passed" | "warnings" | "failed";
  risk_flags: ScriptRiskFlag[];
  requires_admin: boolean;
  touches_network: boolean;
  touches_registry: boolean;
  touches_filesystem: boolean;
  notes: string;
};

export function scanPowerShellSafety(scriptBody: string): ScriptSafetyScanResult {
  const staticScan = scanPowerShellScript(scriptBody);
  const riskFlags = Array.from(
    new Set(staticScan.matched_patterns.map((pattern) => mapPatternToRiskFlag(pattern.id))),
  );
  const riskLevel = getRiskLevel(staticScan.risk_score);

  return {
    risk_level: riskLevel,
    scan_required: true,
    scan_status:
      staticScan.recommended_review_level === "block_until_review"
        ? "failed"
        : riskFlags.length > 0
          ? "warnings"
          : "passed",
    risk_flags: riskFlags,
    requires_admin:
      /#requires\s+-RunAsAdministrator|Start-Process[\s\S]{0,120}-Verb\s+RunAs/i.test(scriptBody) ||
      staticScan.matched_patterns.some((pattern) =>
        ["service_creation", "firewall_changes", "user_creation", "role_assignment_changes"].includes(pattern.id),
      ),
    touches_network: riskFlags.includes("remote_network") || riskFlags.includes("download_execute"),
    touches_registry: riskFlags.includes("registry_change"),
    touches_filesystem: riskFlags.includes("destructive_filesystem"),
    notes:
      staticScan.warnings.length > 0
        ? `Safety scan flagged: ${staticScan.warnings.join(" ")} Reviewer approval is still required.`
        : "Safety scan passed static checks. Reviewer approval is still required.",
  };
}

function getRiskLevel(score: number): ScriptSafetyLevel {
  if (score >= 70) {
    return "critical";
  }

  if (score >= 40) {
    return "high";
  }

  if (score >= 15) {
    return "medium";
  }

  return "low";
}

function mapPatternToRiskFlag(patternId: SafetyScannerPatternId): ScriptRiskFlag {
  const map: Record<SafetyScannerPatternId, ScriptRiskFlag> = {
    remove_item: "destructive_filesystem",
    invoke_expression: "obfuscation",
    iex_alias: "obfuscation",
    start_process: "privilege_escalation",
    set_execution_policy: "policy_change",
    invoke_web_request: "remote_network",
    curl: "remote_network",
    wget: "remote_network",
    web_client: "remote_network",
    encoded_command: "encoded_command",
    registry_edits: "registry_change",
    scheduled_task_creation: "scheduled_task",
    service_creation: "service_change",
    firewall_changes: "firewall_change",
    user_creation: "privilege_escalation",
    role_assignment_changes: "privilege_escalation",
    permission_changes: "privilege_escalation",
    graph_permission_grant_changes: "privilege_escalation",
    oauth_app_consent_changes: "privilege_escalation",
  };

  return map[patternId];
}
