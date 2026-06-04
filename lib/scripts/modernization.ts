import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { scriptSubmissionSchema, type ScriptSubmission } from "./schema";

export type ScriptMaturity = "rewrite" | "enhancement" | "acceptable";

export type ModernizationFeatureMap = {
  frameworkImport: boolean;
  cmdletBinding: boolean;
  structuredLogging: boolean;
  tryCatch: boolean;
  whatIf: boolean;
  dryRun: boolean;
  rollback: boolean;
  htmlReport: boolean;
  csvExport: boolean;
  jsonExport: boolean;
  operatorSummary: boolean;
  riskScoring: boolean;
  healthScoring: boolean;
  executionTiming: boolean;
  exceptionTracking: boolean;
  permissionValidation: boolean;
  powershellVersionValidation: boolean;
  moduleDependencyValidation: boolean;
  tenantCollection: boolean;
  machineCollection: boolean;
  evidenceCollection: boolean;
};

export type ModernizationAssessment = {
  title: string;
  slug: string;
  category: string;
  path: string;
  maturity: ScriptMaturity;
  qualityScore: number;
  safetyScore: number;
  complexityScore: number;
  productionReadinessScore: number;
  features: ModernizationFeatureMap;
  requiredActions: string[];
};

export type ModernizationRoadmap = {
  generated_at: string;
  official_script_count: number;
  requiring_rewrite: ModernizationAssessment[];
  requiring_enhancement: ModernizationAssessment[];
  already_acceptable: ModernizationAssessment[];
  scripts: ModernizationAssessment[];
};

const FEATURE_LABELS: Record<keyof ModernizationFeatureMap, string> = {
  frameworkImport: "Imports OperatorOS framework",
  cmdletBinding: "Uses CmdletBinding",
  structuredLogging: "Uses structured logging",
  tryCatch: "Wraps execution in try/catch",
  whatIf: "Supports WhatIf",
  dryRun: "Supports DryRun",
  rollback: "Defines rollback behavior",
  htmlReport: "Exports HTML report",
  csvExport: "Exports CSV",
  jsonExport: "Exports JSON",
  operatorSummary: "Outputs operator summary",
  riskScoring: "Calculates risk score",
  healthScoring: "Calculates health score",
  executionTiming: "Tracks execution timing",
  exceptionTracking: "Tracks exceptions",
  permissionValidation: "Validates permissions",
  powershellVersionValidation: "Validates PowerShell version",
  moduleDependencyValidation: "Validates module dependencies",
  tenantCollection: "Collects tenant information",
  machineCollection: "Collects machine information",
  evidenceCollection: "Collects evidence",
};

export async function buildModernizationRoadmap(rootDir = process.cwd()): Promise<ModernizationRoadmap> {
  const scripts = await readOfficialScripts(rootDir);
  const assessments = scripts
    .map((script) => assessOfficialScript(script, rootDir))
    .sort((left, right) => left.category.localeCompare(right.category) || left.title.localeCompare(right.title));

  return {
    generated_at: new Date().toISOString(),
    official_script_count: assessments.length,
    requiring_rewrite: assessments.filter((script) => script.maturity === "rewrite"),
    requiring_enhancement: assessments.filter((script) => script.maturity === "enhancement"),
    already_acceptable: assessments.filter((script) => script.maturity === "acceptable"),
    scripts: assessments,
  };
}

export async function writeModernizationRoadmap(rootDir = process.cwd()) {
  const roadmap = await buildModernizationRoadmap(rootDir);
  const jsonPath = join(rootDir, "public", "official-script-modernization-roadmap.json");
  const markdownPath = join(rootDir, "docs", "Official-Script-Modernization-Roadmap.md");

  await mkdir(dirname(jsonPath), { recursive: true });
  await mkdir(dirname(markdownPath), { recursive: true });
  await writeFile(jsonPath, `${JSON.stringify(roadmap, null, 2)}\n`, "utf8");
  await writeFile(markdownPath, buildRoadmapMarkdown(roadmap), "utf8");

  return { roadmap, jsonPath, markdownPath };
}

export function assessOfficialScript(
  script: { submission: ScriptSubmission; scriptBody: string; scriptPath: string },
  rootDir = process.cwd(),
): ModernizationAssessment {
  const body = script.scriptBody;
  const lowered = body.toLowerCase();
  const features: ModernizationFeatureMap = {
    frameworkImport: /OperatorOS-ScriptFramework\.psm1/i.test(body),
    cmdletBinding: /\[CmdletBinding\(/i.test(body),
    structuredLogging: /Write-OperatorOSLog|Start-Transcript|Write-Information|Write-Verbose/i.test(body),
    tryCatch: /\btry\s*\{|catch\s*\{/i.test(body),
    whatIf: /SupportsShouldProcess|ShouldProcess|\bWhatIf\b/i.test(body),
    dryRun: /\bDryRun\b|dry run/i.test(body),
    rollback: /Rollback|Register-OperatorOSRollbackAction|Invoke-OperatorOSRollback/i.test(body),
    htmlReport: /Export-OperatorOSReport|ConvertTo-Html|\.html\b/i.test(body),
    csvExport: /Export-OperatorOSReport|Export-Csv|\.csv\b/i.test(body),
    jsonExport: /Export-OperatorOSReport|ConvertTo-Json|\.json\b/i.test(body),
    operatorSummary: /Get-OperatorOSSummary|Complete-OperatorOSExecution|operator summary/i.test(body),
    riskScoring: /Get-OperatorOSRiskScore|RiskScore|risk score/i.test(body),
    healthScoring: /Get-OperatorOSHealthScore|HealthScore|health score/i.test(body),
    executionTiming: /StartedAt|DurationSeconds|Stopwatch|execution timing/i.test(body),
    exceptionTracking: /Add-OperatorOSException|\$_.Exception|exception/i.test(body),
    permissionValidation: /Assert-OperatorOSPermission|permission/i.test(body),
    powershellVersionValidation: /Assert-OperatorOSPowerShellVersion|\$PSVersionTable/i.test(body),
    moduleDependencyValidation: /Assert-OperatorOSModuleDependency|Get-Module -ListAvailable/i.test(body),
    tenantCollection: /Get-OperatorOSTenantInfo|tenant/i.test(body),
    machineCollection: /Get-OperatorOSMachineInfo|Get-ComputerInfo|Win32_OperatingSystem|machine/i.test(body),
    evidenceCollection: /Add-OperatorOSEvidence|Evidence/i.test(body),
  };

  const implementedFeatureCount = Object.values(features).filter(Boolean).length;
  const qualityScore = clampScore(Math.round((implementedFeatureCount / Object.keys(features).length) * 100));
  const safetyScore = calculateSafetyScore(script.submission, features, lowered);
  const complexityScore = calculateComplexityScore(body, script.submission);
  const productionReadinessScore = clampScore(Math.round(qualityScore * 0.45 + safetyScore * 0.35 + documentationScore(script.submission) * 0.2));
  const maturity = productionReadinessScore >= 80 ? "acceptable" : productionReadinessScore >= 50 ? "enhancement" : "rewrite";

  return {
    title: script.submission.title,
    slug: script.submission.slug,
    category: script.submission.category,
    path: relative(rootDir, script.scriptPath),
    maturity,
    qualityScore,
    safetyScore,
    complexityScore,
    productionReadinessScore,
    features,
    requiredActions: getRequiredActions(features, maturity),
  };
}

export function buildRoadmapMarkdown(roadmap: ModernizationRoadmap): string {
  return `# Official Script Modernization Roadmap

Generated: ${roadmap.generated_at}

## Summary

- Official scripts reviewed: ${roadmap.official_script_count}
- Scripts requiring rewrite: ${roadmap.requiring_rewrite.length}
- Scripts requiring enhancement: ${roadmap.requiring_enhancement.length}
- Scripts already acceptable: ${roadmap.already_acceptable.length}

## Scoring Model

- Quality score measures framework adoption, logging, validation, reporting, scoring, evidence collection, and operator guidance.
- Safety score measures safety mode, rollback, WhatIf/DryRun, exception tracking, dependency validation, and risky command posture.
- Complexity score estimates operational complexity from script size, parameters, module requirements, and safety flags.
- Production readiness combines quality, safety, and documentation completeness.

## Scripts Requiring Rewrite

${formatAssessmentTable(roadmap.requiring_rewrite)}

## Scripts Requiring Enhancement

${formatAssessmentTable(roadmap.requiring_enhancement)}

## Scripts Already Acceptable

${formatAssessmentTable(roadmap.already_acceptable)}

## Modernization Requirements

Every official OperatorOS script should:

- Import \`OperatorOS-ScriptFramework.psm1\`.
- Use \`[CmdletBinding(SupportsShouldProcess = $true)]\`.
- Support \`-ConfigPath\`, environment-derived config, parameter overrides, \`-DryRun\`, and native \`-WhatIf\`.
- Use structured OperatorOS logging and transcript support for technician evidence.
- Validate PowerShell version, required modules, and required permissions before execution.
- Collect tenant, machine, timing, exception, and evidence data.
- Export HTML, CSV, and JSON reports where the output is reportable.
- Return an operator summary with risk score, health score, findings, warnings, and next actions.
- Define rollback behavior for any remediation or emergency workflow.

## Modernization Templates

- \`templates/modernization/microsoft-365-enterprise-template.ps1\`
- \`templates/modernization/exchange-online-enterprise-template.ps1\`
- \`templates/modernization/entra-id-enterprise-template.ps1\`
- \`templates/modernization/active-directory-enterprise-template.ps1\`
- \`templates/modernization/windows-server-enterprise-template.ps1\`
- \`templates/modernization/datto-rmm-enterprise-template.ps1\`
- \`templates/modernization/security-auditing-enterprise-template.ps1\`
`;
}

async function readOfficialScripts(rootDir: string) {
  const operatorOsDir = join(rootDir, "content", "scripts", "operatoros");
  const metadataPaths = await findFiles(operatorOsDir, ".json");

  return (
    await Promise.all(
      metadataPaths.map(async (metadataPath) => {
        try {
          const submission = scriptSubmissionSchema.parse(JSON.parse(await readFile(metadataPath, "utf8")));

          if (submission.source_type !== "operatoros") {
            return null;
          }

          const folder = dirname(metadataPath);
          const files = await readdir(folder);
          const scriptFile = files.find((file) => file.startsWith(submission.slug) && extname(file).toLowerCase() === ".ps1");

          if (!scriptFile) {
            return null;
          }

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

      if (entry.isDirectory()) {
        if (entry.name === "_framework") {
          return [];
        }

        return findFiles(path, extension);
      }

      return entry.isFile() && extname(entry.name).toLowerCase() === extension ? [path] : [];
    }),
  );

  return nested.flat();
}

function calculateSafetyScore(submission: ScriptSubmission, features: ModernizationFeatureMap, loweredBody: string) {
  let score = submission.safety.risk_level === "low" ? 65 : submission.safety.risk_level === "medium" ? 50 : 35;

  if (features.frameworkImport) score += 8;
  if (features.whatIf) score += 8;
  if (features.dryRun) score += 7;
  if (features.rollback) score += 7;
  if (features.tryCatch) score += 5;
  if (features.exceptionTracking) score += 4;
  if (features.permissionValidation) score += 3;
  if (features.moduleDependencyValidation) score += 3;
  if (/remove-item|set-executionpolicy|invoke-expression|\biex\b|encodedcommand/.test(loweredBody)) score -= 20;

  return clampScore(score);
}

function calculateComplexityScore(scriptBody: string, submission: ScriptSubmission) {
  const lines = scriptBody.split(/\r?\n/).filter((line) => line.trim()).length;
  const parameterWeight = submission.parameters.length * 5;
  const riskWeight = submission.safety.risk_flags.length * 10;
  const moduleWeight = submission.requirements.filter((requirement) => /module|graph|exchange|active directory/i.test(requirement.name)).length * 8;

  return clampScore(Math.round(Math.min(100, lines * 1.2 + parameterWeight + riskWeight + moduleWeight)));
}

function documentationScore(submission: ScriptSubmission) {
  let score = 20;

  if (submission.summary.length > 40) score += 15;
  if (submission.description.length > 120) score += 20;
  if (submission.use_case.length > 80) score += 15;
  if (submission.examples.length > 0) score += 10;
  if (submission.requirements.length > 0) score += 10;
  if (submission.documentation.changelog) score += 10;

  return clampScore(score);
}

function getRequiredActions(features: ModernizationFeatureMap, maturity: ScriptMaturity) {
  const missing = Object.entries(features)
    .filter(([, enabled]) => !enabled)
    .map(([feature]) => FEATURE_LABELS[feature as keyof ModernizationFeatureMap]);

  if (maturity === "acceptable") {
    return missing.slice(0, 5);
  }

  return missing;
}

function formatAssessmentTable(scripts: ModernizationAssessment[]) {
  if (scripts.length === 0) {
    return "No scripts in this category.\n";
  }

  const rows = scripts.map(
    (script) =>
      `| ${escapeTable(script.title)} | ${script.category} | ${script.qualityScore} | ${script.safetyScore} | ${script.complexityScore} | ${script.productionReadinessScore} | ${escapeTable(script.requiredActions.slice(0, 4).join("; "))} |`,
  );

  return [
    "| Script | Category | Quality | Safety | Complexity | Readiness | Top Actions |",
    "| --- | --- | ---: | ---: | ---: | ---: | --- |",
    ...rows,
    "",
  ].join("\n");
}

function escapeTable(value: string) {
  return value.replace(/\|/g, "\\|");
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

async function runCli() {
  const { roadmap, jsonPath, markdownPath } = await writeModernizationRoadmap();
  process.stdout.write(
    `Reviewed ${roadmap.official_script_count} official script(s). Roadmap: ${relative(process.cwd(), markdownPath)} and ${relative(process.cwd(), jsonPath)}\n`,
  );
}

const currentFile = fileURLToPath(import.meta.url);

if (process.argv[1] && currentFile === process.argv[1]) {
  runCli().catch((error) => {
    const message = error instanceof Error ? error.message : "Failed to build modernization roadmap.";
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
