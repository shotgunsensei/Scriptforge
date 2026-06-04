export type RecommendedReviewLevel = "standard" | "elevated" | "security_required" | "block_until_review";

export type SafetyScannerPatternId =
  | "remove_item"
  | "invoke_expression"
  | "iex_alias"
  | "start_process"
  | "set_execution_policy"
  | "invoke_web_request"
  | "curl"
  | "wget"
  | "web_client"
  | "encoded_command"
  | "registry_edits"
  | "scheduled_task_creation"
  | "service_creation"
  | "firewall_changes"
  | "user_creation"
  | "role_assignment_changes"
  | "permission_changes"
  | "graph_permission_grant_changes"
  | "oauth_app_consent_changes";

export type MatchedSafetyPattern = {
  id: SafetyScannerPatternId;
  label: string;
  severity: "medium" | "high" | "critical";
  score: number;
  matches: string[];
};

export type PowerShellSafetyScan = {
  risk_score: number;
  matched_patterns: MatchedSafetyPattern[];
  warnings: string[];
  recommended_review_level: RecommendedReviewLevel;
};

type SafetyScannerRule = Omit<MatchedSafetyPattern, "matches"> & {
  pattern: RegExp;
  warning: string;
};

const SAFETY_SCANNER_RULES: SafetyScannerRule[] = [
  {
    id: "remove_item",
    label: "Remove-Item",
    severity: "high",
    score: 18,
    pattern: /\bRemove-Item\b/gi,
    warning: "Uses Remove-Item. Review destructive filesystem impact before approval.",
  },
  {
    id: "invoke_expression",
    label: "Invoke-Expression",
    severity: "critical",
    score: 25,
    pattern: /\bInvoke-Expression\b/gi,
    warning: "Uses Invoke-Expression. Dynamic command execution requires security review.",
  },
  {
    id: "iex_alias",
    label: "iex alias",
    severity: "critical",
    score: 25,
    pattern: /(^|[\s;|&])iex($|[\s;|&])/gi,
    warning: "Uses iex alias. Dynamic command execution requires security review.",
  },
  {
    id: "start_process",
    label: "Start-Process",
    severity: "medium",
    score: 10,
    pattern: /\bStart-Process\b/gi,
    warning: "Uses Start-Process. Review process launch target and arguments.",
  },
  {
    id: "set_execution_policy",
    label: "Set-ExecutionPolicy",
    severity: "high",
    score: 18,
    pattern: /\bSet-ExecutionPolicy\b/gi,
    warning: "Changes PowerShell execution policy. Confirm scope and rollback path.",
  },
  {
    id: "invoke_web_request",
    label: "Invoke-WebRequest",
    severity: "medium",
    score: 12,
    pattern: /\bInvoke-WebRequest\b|\biwr\b/gi,
    warning: "Uses Invoke-WebRequest. Review remote URL handling and downloaded content.",
  },
  {
    id: "curl",
    label: "curl",
    severity: "medium",
    score: 10,
    pattern: /(^|[\s;|&])curl(\.exe)?($|[\s;|&])/gi,
    warning: "Uses curl. Review remote URL handling and downloaded content.",
  },
  {
    id: "wget",
    label: "wget",
    severity: "medium",
    score: 10,
    pattern: /(^|[\s;|&])wget(\.exe)?($|[\s;|&])/gi,
    warning: "Uses wget. Review remote URL handling and downloaded content.",
  },
  {
    id: "web_client",
    label: "New-Object Net.WebClient",
    severity: "high",
    score: 18,
    pattern: /\bNew-Object\s+(System\.)?Net\.WebClient\b/gi,
    warning: "Uses Net.WebClient. Review download and exfiltration risk.",
  },
  {
    id: "encoded_command",
    label: "EncodedCommand",
    severity: "critical",
    score: 30,
    pattern: /\b-?EncodedCommand\b|\s-enc\s/gi,
    warning: "Uses EncodedCommand. Obfuscated payloads require security review.",
  },
  {
    id: "registry_edits",
    label: "Registry edits",
    severity: "high",
    score: 18,
    pattern: /\b(New-ItemProperty|Set-ItemProperty|Remove-ItemProperty|reg\s+(add|delete|import)|HKLM:|HKCU:|Registry::)\b/gi,
    warning: "Touches Windows registry. Confirm keys, scope, and rollback path.",
  },
  {
    id: "scheduled_task_creation",
    label: "Scheduled task creation",
    severity: "high",
    score: 18,
    pattern: /\b(Register-ScheduledTask|New-ScheduledTask|schtasks(\.exe)?\s+\/create)\b/gi,
    warning: "Creates or registers scheduled tasks. Review persistence behavior.",
  },
  {
    id: "service_creation",
    label: "Service creation",
    severity: "high",
    score: 18,
    pattern: /\b(New-Service|sc(\.exe)?\s+create)\b/gi,
    warning: "Creates Windows services. Review persistence and privilege context.",
  },
  {
    id: "firewall_changes",
    label: "Firewall changes",
    severity: "high",
    score: 18,
    pattern: /\b(New-NetFirewallRule|Set-NetFirewallRule|Remove-NetFirewallRule|netsh\s+advfirewall)\b/gi,
    warning: "Changes firewall configuration. Review network exposure impact.",
  },
  {
    id: "user_creation",
    label: "User creation",
    severity: "critical",
    score: 28,
    pattern: /\b(New-LocalUser|net\s+user\s+\S+\s+\S+\s+\/add|New-MgUser|New-AzureADUser)\b/gi,
    warning: "Creates local or cloud users. Requires identity/security review.",
  },
  {
    id: "role_assignment_changes",
    label: "Role assignment changes",
    severity: "critical",
    score: 28,
    pattern: /\b(Add-LocalGroupMember|Add-MgDirectoryRoleMember|New-MgRoleManagementDirectoryRoleAssignment|New-AzureADMSPrivilegedRoleAssignment|az\s+role\s+assignment\s+create)\b/gi,
    warning: "Changes role assignments. Requires privilege and tenant-impact review.",
  },
  {
    id: "permission_changes",
    label: "Permission changes",
    severity: "high",
    score: 22,
    pattern: /\b(Set-Acl|icacls(\.exe)?|chmod|Grant-SmbShareAccess|Grant-NTFSAccess|Add-MailboxPermission|Add-RecipientPermission)\b/gi,
    warning: "Changes permissions or ACLs. Review access boundaries and rollback path.",
  },
  {
    id: "graph_permission_grant_changes",
    label: "Graph permission grant changes",
    severity: "critical",
    score: 30,
    pattern: /\b(New-MgOauth2PermissionGrant|Update-MgOauth2PermissionGrant|New-MgServicePrincipalAppRoleAssignment|appRoleAssignedTo|oauth2PermissionGrants)\b/gi,
    warning: "Changes Microsoft Graph permission grants. Requires tenant admin security review.",
  },
  {
    id: "oauth_app_consent_changes",
    label: "OAuth app consent changes",
    severity: "critical",
    score: 30,
    pattern: /\b(AdminConsent|ConsentType\s*(=|\s)\s*['\"]?AllPrincipals|Grant-Mg|New-AzureADServiceAppRoleAssignment|oauth2PermissionScopes)\b/gi,
    warning: "Changes OAuth app consent or app role grants. Requires tenant admin security review.",
  },
];

export function scanPowerShellScript(scriptBody: string): PowerShellSafetyScan {
  const matchedPatterns = SAFETY_SCANNER_RULES.map((rule) => {
    const matches = Array.from(scriptBody.matchAll(rule.pattern), (match) => match[0].trim()).filter(Boolean);

    if (matches.length === 0) {
      return null;
    }

    return {
      id: rule.id,
      label: rule.label,
      severity: rule.severity,
      score: rule.score,
      matches: Array.from(new Set(matches)),
    } satisfies MatchedSafetyPattern;
  }).filter((match): match is MatchedSafetyPattern => match !== null);

  const riskScore = Math.min(
    100,
    matchedPatterns.reduce((total, pattern) => total + pattern.score, 0),
  );

  const warnings = SAFETY_SCANNER_RULES.filter((rule) =>
    matchedPatterns.some((pattern) => pattern.id === rule.id),
  ).map((rule) => rule.warning);

  return {
    risk_score: riskScore,
    matched_patterns: matchedPatterns,
    warnings,
    recommended_review_level: getRecommendedReviewLevel(riskScore, matchedPatterns),
  };
}

export const scanPowerShellSafetyStatic = scanPowerShellScript;

function getRecommendedReviewLevel(
  riskScore: number,
  matchedPatterns: MatchedSafetyPattern[],
): RecommendedReviewLevel {
  if (
    riskScore >= 70 ||
    matchedPatterns.some(
      (pattern) =>
        pattern.id === "encoded_command" ||
        pattern.id === "graph_permission_grant_changes" ||
        pattern.id === "oauth_app_consent_changes",
    )
  ) {
    return "block_until_review";
  }

  if (riskScore >= 40 || matchedPatterns.some((pattern) => pattern.severity === "critical")) {
    return "security_required";
  }

  if (riskScore >= 15) {
    return "elevated";
  }

  return "standard";
}
