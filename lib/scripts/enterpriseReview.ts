import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { assessOfficialScript, type ModernizationAssessment } from "./modernization";
import { scriptSubmissionSchema, type ScriptSubmission } from "./schema";

export type EnterpriseScriptClassification =
  | "Utility"
  | "Audit"
  | "Remediation"
  | "Emergency Response"
  | "Investigation"
  | "Reporting"
  | "Deployment";

export type ReviewFindingSeverity = "critical" | "high" | "medium" | "low";

export type EnterpriseReviewFinding = {
  severity: ReviewFindingSeverity;
  area: "Parameter Design" | "Error Handling" | "Logging" | "Performance" | "Security" | "Maintainability" | "Documentation" | "Production Readiness";
  message: string;
};

export type EnterpriseScriptReview = ModernizationAssessment & {
  classification: EnterpriseScriptClassification;
  rewritePriority: 1 | 2 | 3 | 4 | 5 | 6;
  findings: EnterpriseReviewFinding[];
  rejectedJuniorPatterns: string[];
  qualityGateFailures: string[];
  reviewedAs: string;
};

export type EnterpriseReviewReport = {
  generated_at: string;
  scripts_reviewed: number;
  scripts_rejected: number;
  scripts_rewritten: number;
  promoted_msp_ready: number;
  promoted_enterprise_ready: number;
  promoted_operatoros_certified: number;
  highest_risk_scripts: EnterpriseScriptReview[];
  lowest_quality_scripts: EnterpriseScriptReview[];
  most_valuable_scripts: EnterpriseScriptReview[];
  quick_win_improvements: EnterpriseScriptReview[];
  rewrite_candidates: EnterpriseScriptReview[];
  scorecards: EnterpriseScriptReview[];
};

const HIGH_VALUE_PATTERNS = [
  /risky.*consent|consent.*audit|oauth.*grant|app.*grant/i,
  /mailbox.*forward|inbox.*rule/i,
  /mfa|authentication.*method/i,
  /conditional.*access/i,
  /inactive.*admin|privileged.*role/i,
  /stale.*user|inactive.*user|stale.*computer|inactive.*computer/i,
  /local.*admin/i,
  /bitlocker/i,
  /datto|rmm.*agent|service.*status/i,
  /patch.*compliance|patch.*report/i,
  /external.*guest|guest.*review/i,
  /transport.*rule/i,
  /secure.*score|defender|exposure/i,
  /mailbox.*permission/i,
  /tenant.*security|security.*baseline/i,
];

export async function buildEnterpriseReviewReport(rootDir = process.cwd()): Promise<EnterpriseReviewReport> {
  const scripts = await readOfficialScripts(rootDir);
  const scorecards = scripts
    .map((script) => reviewOfficialScript(script, rootDir))
    .sort((left, right) => right.businessValueScore - left.businessValueScore || left.title.localeCompare(right.title));

  return {
    generated_at: new Date().toISOString(),
    scripts_reviewed: scorecards.length,
    scripts_rejected: scorecards.filter((script) => script.qualityGateFailures.length > 0 || script.findings.some((finding) => finding.severity === "critical" || finding.severity === "high")).length,
    scripts_rewritten: 0,
    promoted_msp_ready: scorecards.filter((script) => script.certificationLevel === "Level 3: MSP Ready").length,
    promoted_enterprise_ready: scorecards.filter((script) => script.certificationLevel === "Level 4: Enterprise Ready").length,
    promoted_operatoros_certified: scorecards.filter((script) => script.certificationLevel === "Level 5: OperatorOS Certified").length,
    highest_risk_scripts: [...scorecards].sort(sortByRisk).slice(0, 20),
    lowest_quality_scripts: [...scorecards].sort((left, right) => left.productionReadinessScore - right.productionReadinessScore).slice(0, 20),
    most_valuable_scripts: [...scorecards].sort((left, right) => right.businessValueScore - left.businessValueScore).slice(0, 20),
    quick_win_improvements: scorecards.filter(isQuickWin).slice(0, 20),
    rewrite_candidates: scorecards.filter((script) => script.maturity === "rewrite").slice(0, 50),
    scorecards,
  };
}

export async function writeEnterpriseReviewReport(rootDir = process.cwd()) {
  const report = await buildEnterpriseReviewReport(rootDir);
  const markdownPath = join(rootDir, "reports", "scriptforge-enterprise-review.md");
  const jsonPath = join(rootDir, "public", "scriptforge-enterprise-review.json");

  await mkdir(dirname(markdownPath), { recursive: true });
  await mkdir(dirname(jsonPath), { recursive: true });
  await writeFile(markdownPath, buildEnterpriseReviewMarkdown(report), "utf8");
  await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  return { report, markdownPath, jsonPath };
}

export function reviewOfficialScript(
  script: { submission: ScriptSubmission; scriptBody: string; scriptPath: string },
  rootDir = process.cwd(),
): EnterpriseScriptReview {
  const assessment = assessOfficialScript(script, rootDir);
  const classification = classifyScript(script.submission, script.scriptBody);
  const findings = buildFindings(script.submission, script.scriptBody, assessment, classification);
  const qualityGateFailures = buildQualityGateFailures(assessment);

  return {
    ...assessment,
    classification,
    rewritePriority: assignRewritePriority(script.submission),
    findings,
    rejectedJuniorPatterns: findings.filter((finding) => finding.severity === "critical" || finding.severity === "high").map((finding) => finding.message),
    qualityGateFailures,
    reviewedAs: "Senior MSP engineer review for multi-tenant, regulated, production operations.",
  };
}

export function buildEnterpriseReviewMarkdown(report: EnterpriseReviewReport) {
  return `# ScriptForge Enterprise Review

Generated: ${report.generated_at}

## Executive Summary

- Scripts reviewed: ${report.scripts_reviewed}
- Scripts rejected by enterprise gate: ${report.scripts_rejected}
- Scripts rewritten in this phase: ${report.scripts_rewritten}
- Promoted to MSP Ready: ${report.promoted_msp_ready}
- Promoted to Enterprise Ready: ${report.promoted_enterprise_ready}
- Promoted to OperatorOS Certified: ${report.promoted_operatoros_certified}

No script is eligible for OperatorOS Certified unless documentation score, safety score, and production readiness are all at least 90, test coverage exists, and framework compliance passes.

## Rewrite Priority Model

- Priority 1: High-value MSP scripts.
- Priority 2: Microsoft 365 and Security.
- Priority 3: Active Directory.
- Priority 4: Exchange.
- Priority 5: Windows utilities.
- Priority 6: Everything else.

## Highest-Risk Scripts

${formatScorecardTable(report.highest_risk_scripts)}

## Lowest-Quality Scripts

${formatScorecardTable(report.lowest_quality_scripts)}

## Most Valuable Scripts

${formatScorecardTable(report.most_valuable_scripts)}

## Quick-Win Improvements

${formatScorecardTable(report.quick_win_improvements)}

## Rewrite Candidates

${formatScorecardTable(report.rewrite_candidates)}

## Final Scorecards

${report.scorecards.map(formatScorecardDetails).join("\n\n")}
`;
}

function buildFindings(
  submission: ScriptSubmission,
  scriptBody: string,
  assessment: ModernizationAssessment,
  classification: EnterpriseScriptClassification,
): EnterpriseReviewFinding[] {
  const findings: EnterpriseReviewFinding[] = [];
  const body = scriptBody.toLowerCase();

  addIf(findings, !/\[CmdletBinding\(/i.test(scriptBody), "high", "Parameter Design", "Missing advanced function CmdletBinding.");
  addIf(findings, !/param\s*\(/i.test(scriptBody), "medium", "Parameter Design", "Missing explicit parameter block.");
  addIf(findings, !/\[Validate(Set|Pattern|Range|NotNull|NotNullOrEmpty|Script)\(/i.test(scriptBody), "medium", "Parameter Design", "Missing parameter validation attributes.");
  addIf(findings, /user@example\.com|contoso|tenant-id|placeholder/i.test(scriptBody), "high", "Security", "Contains hardcoded placeholder value.");
  addIf(findings, /\$global:/i.test(scriptBody), "high", "Maintainability", "Uses global variable state.");
  addIf(findings, /Write-Host/i.test(scriptBody) && !/Write-Output|Export-OperatorOSReport/i.test(scriptBody), "high", "Logging", "Uses Write-Host-only output.");
  addIf(findings, !/<#\s*\.SYNOPSIS/i.test(scriptBody), "medium", "Documentation", "Missing comment-based help.");
  addIf(findings, !assessment.features.tryCatch, "high", "Error Handling", "Missing try/catch error handling.");
  addIf(findings, !assessment.features.structuredLogging, "high", "Logging", "Missing structured framework logging.");
  addIf(findings, !assessment.features.moduleDependencyValidation, "high", "Production Readiness", "Missing module dependency validation.");
  addIf(findings, !assessment.features.permissionValidation, "high", "Security", "Missing permission validation.");
  addIf(findings, !assessment.features.whatIf, "medium", "Production Readiness", "Missing ShouldProcess/WhatIf support.");
  addIf(findings, !/EnableTranscript|Start-OperatorOSTranscript|Start-Transcript/i.test(scriptBody), "medium", "Logging", "Missing transcript logging support.");
  addIf(findings, !assessment.features.htmlReport || !assessment.features.csvExport || !assessment.features.jsonExport, "high", "Production Readiness", "Missing HTML/CSV/JSON export support.");
  addIf(findings, !assessment.features.operatorSummary, "high", "Production Readiness", "Missing operator summary output.");
  addIf(findings, !assessment.features.riskScoring || !assessment.features.healthScoring, "high", "Production Readiness", "Missing risk and health scoring.");
  addIf(findings, !assessment.features.evidenceCollection, "medium", "Production Readiness", "Missing evidence collection.");
  addIf(findings, scriptBody.split(/\r?\n/).filter((line) => line.trim()).length < 25, "critical", "Maintainability", "Script body is too thin for enterprise operational use.");
  addIf(findings, classification === "Remediation" && !assessment.features.rollback, "critical", "Production Readiness", "Remediation workflow lacks rollback logic.");
  addIf(findings, classification === "Audit" && /set-|new-|remove-|disable-|enable-/i.test(body), "critical", "Security", "Audit script appears to include state-changing verbs.");

  if (submission.documentation.references.length === 0) {
    findings.push({
      severity: "low",
      area: "Documentation",
      message: "No vendor or internal reference links are attached.",
    });
  }

  return findings;
}

function buildQualityGateFailures(assessment: ModernizationAssessment) {
  const failures = [];

  if (assessment.documentationScore < 90) failures.push("Documentation score below 90.");
  if (assessment.safetyScore < 90) failures.push("Safety score below 90.");
  if (assessment.productionReadinessScore < 90) failures.push("Production readiness below 90.");
  if (assessment.testingScore < 90) failures.push("Test coverage evidence missing or insufficient.");
  if (
    !assessment.features.frameworkImport ||
    !assessment.features.cmdletBinding ||
    !assessment.features.structuredLogging ||
    !assessment.features.tryCatch ||
    !assessment.features.htmlReport ||
    !assessment.features.csvExport ||
    !assessment.features.jsonExport ||
    !assessment.features.operatorSummary ||
    !assessment.features.riskScoring ||
    !assessment.features.healthScoring
  ) {
    failures.push("Framework compliance gate failed.");
  }

  return failures;
}

function classifyScript(submission: ScriptSubmission, scriptBody: string): EnterpriseScriptClassification {
  const combined = `${submission.title} ${submission.slug} ${submission.tags.join(" ")} ${scriptBody}`.toLowerCase();

  if (/emergency|incident|breach|containment|response/.test(combined)) return "Emergency Response";
  if (/deploy|install|rollout|provision/.test(combined)) return "Deployment";
  if (/remediation|repair|fix|remove|disable|enable|set-/.test(combined)) return "Remediation";
  if (/investigat|forensic|event|log|trace|threat/.test(combined)) return "Investigation";
  if (/report|export|inventory|summary/.test(combined)) return "Reporting";
  if (/audit|review|baseline|compliance/.test(combined)) return "Audit";

  return "Utility";
}

function assignRewritePriority(submission: ScriptSubmission): 1 | 2 | 3 | 4 | 5 | 6 {
  const combined = `${submission.title} ${submission.slug} ${submission.tags.join(" ")}`;

  if (HIGH_VALUE_PATTERNS.some((pattern) => pattern.test(combined))) return 1;
  if (submission.category === "microsoft-365" || submission.category === "security" || submission.category === "entra-id") return 2;
  if (submission.category === "active-directory") return 3;
  if (submission.category === "exchange-online") return 4;
  if (submission.category === "windows-server" || submission.category === "workstation-repair") return 5;

  return 6;
}

async function readOfficialScripts(rootDir: string) {
  const operatorOsDir = join(rootDir, "content", "scripts", "operatoros");
  const metadataPaths = await findFiles(operatorOsDir, ".json");

  return (
    await Promise.all(
      metadataPaths.map(async (metadataPath) => {
        try {
          const submission = scriptSubmissionSchema.parse(JSON.parse(await readFile(metadataPath, "utf8")));

          if (submission.source_type !== "operatoros") return null;

          const folder = dirname(metadataPath);
          const files = await readdir(folder);
          const scriptFile = files.find((file) => file.startsWith(submission.slug) && extname(file).toLowerCase() === ".ps1");

          if (!scriptFile) return null;

          const scriptPath = join(folder, scriptFile);
          const scriptBody = await readFile(scriptPath, "utf8");

          return { submission, scriptBody, scriptPath };
        } catch {
          return null;
        }
      }),
    )
  ).filter((script): script is { submission: ScriptSubmission; scriptBody: string; scriptPath: string } => script !== null);
}

async function findFiles(root: string, extension: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(root, entry.name);

      if (entry.isDirectory()) return findFiles(path, extension);

      return entry.isFile() && extname(entry.name).toLowerCase() === extension ? [path] : [];
    }),
  );

  return nested.flat();
}

function isQuickWin(script: EnterpriseScriptReview) {
  return script.productionReadinessScore >= 40 && script.productionReadinessScore < 65 && script.findings.length <= 12;
}

function sortByRisk(left: EnterpriseScriptReview, right: EnterpriseScriptReview) {
  return severityWeight(right) - severityWeight(left) || right.businessValueScore - left.businessValueScore;
}

function severityWeight(script: EnterpriseScriptReview) {
  return script.findings.reduce((score, finding) => {
    if (finding.severity === "critical") return score + 5;
    if (finding.severity === "high") return score + 3;
    if (finding.severity === "medium") return score + 1;

    return score;
  }, 0);
}

function addIf(
  findings: EnterpriseReviewFinding[],
  condition: boolean,
  severity: ReviewFindingSeverity,
  area: EnterpriseReviewFinding["area"],
  message: string,
) {
  if (condition) {
    findings.push({ severity, area, message });
  }
}

function formatScorecardTable(scripts: EnterpriseScriptReview[]) {
  if (scripts.length === 0) return "No scripts in this section.\n";

  return [
    "| Script | Category | Priority | Class | Readiness | Cert | Top Finding |",
    "| --- | --- | ---: | --- | ---: | --- | --- |",
    ...scripts.map(
      (script) =>
        `| ${escapeTable(script.title)} | ${script.category} | ${script.rewritePriority} | ${script.classification} | ${script.productionReadinessScore} | ${script.certificationLevel} | ${escapeTable(script.findings[0]?.message ?? "No finding")} |`,
    ),
    "",
  ].join("\n");
}

function formatScorecardDetails(script: EnterpriseScriptReview) {
  return `### ${script.title}

- Slug: \`${script.slug}\`
- Category: \`${script.category}\`
- Path: \`${script.path}\`
- Classification: ${script.classification}
- Rewrite priority: ${script.rewritePriority}
- Documentation score: ${script.documentationScore}
- Safety score: ${script.safetyScore}
- Operational maturity score: ${script.operationalMaturityScore}
- Testing score: ${script.testingScore}
- Maintainability score: ${script.maintainabilityScore}
- Production readiness score: ${script.productionReadinessScore}
- Certification level: ${script.certificationLevel}
- Business value score: ${script.businessValueScore}
- Quality gate failures: ${script.qualityGateFailures.length > 0 ? script.qualityGateFailures.join("; ") : "none"}
- Recommendation: ${script.rewriteRecommendation}

Findings:
${script.findings.map((finding) => `- ${finding.severity.toUpperCase()} [${finding.area}] ${finding.message}`).join("\n")}
`;
}

function escapeTable(value: string) {
  return value.replace(/\|/g, "\\|");
}

async function runCli() {
  const { report, markdownPath, jsonPath } = await writeEnterpriseReviewReport();
  process.stdout.write(
    `Reviewed ${report.scripts_reviewed} official script(s). Enterprise review: ${relative(process.cwd(), markdownPath)} and ${relative(process.cwd(), jsonPath)}\n`,
  );
}

const currentFile = fileURLToPath(import.meta.url);

if (process.argv[1] && currentFile === process.argv[1]) {
  runCli().catch((error) => {
    const message = error instanceof Error ? error.message : "Failed to build enterprise review.";
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
