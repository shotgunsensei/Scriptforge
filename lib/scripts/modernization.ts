import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreScriptQuality, type CertificationLevel } from "./qualityEngine";
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
  documentationScore: number;
  operationalMaturityScore: number;
  safetyScore: number;
  testingScore: number;
  maintainabilityScore: number;
  complexityScore: number;
  productionReadinessScore: number;
  certificationLevel: CertificationLevel;
  businessValueScore: number;
  features: ModernizationFeatureMap;
  requiredActions: string[];
  rewriteRecommendation: string;
};

export type ModernizationRoadmap = {
  generated_at: string;
  official_script_count: number;
  requiring_rewrite: ModernizationAssessment[];
  requiring_enhancement: ModernizationAssessment[];
  already_acceptable: ModernizationAssessment[];
  scripts: ModernizationAssessment[];
};

export type ModernizationDashboardData = {
  roadmap: ModernizationRoadmap;
  maturityCounts: Record<ScriptMaturity, number>;
  certificationCounts: Record<CertificationLevel, number>;
  categoryAverages: Array<{
    category: string;
    scriptCount: number;
    qualityAverage: number;
    safetyAverage: number;
    maturityAverage: number;
    readinessAverage: number;
  }>;
  frameworkCompliance: {
    totalScripts: number;
    importingFramework: number;
    cmdletBinding: number;
    reportingReady: number;
    scoringReady: number;
    compliancePercent: number;
  };
  rewriteQueue: ModernizationAssessment[];
  enhancementQueue: ModernizationAssessment[];
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

export async function buildModernizationDashboardData(rootDir = process.cwd()): Promise<ModernizationDashboardData> {
  const roadmap = await buildModernizationRoadmap(rootDir);
  const certificationCounts = roadmap.scripts.reduce(
    (counts, script) => {
      counts[script.certificationLevel] += 1;
      return counts;
    },
    {
      "Level 1: Basic Utility": 0,
      "Level 2: Technician Ready": 0,
      "Level 3: MSP Ready": 0,
      "Level 4: Enterprise Ready": 0,
      "Level 5: OperatorOS Certified": 0,
    } satisfies Record<CertificationLevel, number>,
  );
  const maturityCounts = roadmap.scripts.reduce(
    (counts, script) => {
      counts[script.maturity] += 1;
      return counts;
    },
    { rewrite: 0, enhancement: 0, acceptable: 0 } satisfies Record<ScriptMaturity, number>,
  );
  const categoryAverages = buildCategoryAverages(roadmap.scripts);
  const importingFramework = roadmap.scripts.filter((script) => script.features.frameworkImport).length;
  const cmdletBinding = roadmap.scripts.filter((script) => script.features.cmdletBinding).length;
  const reportingReady = roadmap.scripts.filter((script) => script.features.htmlReport && script.features.csvExport && script.features.jsonExport).length;
  const scoringReady = roadmap.scripts.filter((script) => script.features.riskScoring && script.features.healthScoring).length;
  const compliancePercent = roadmap.official_script_count === 0 ? 0 : Math.round((importingFramework / roadmap.official_script_count) * 100);

  return {
    roadmap,
    maturityCounts,
    certificationCounts,
    categoryAverages,
    frameworkCompliance: {
      totalScripts: roadmap.official_script_count,
      importingFramework,
      cmdletBinding,
      reportingReady,
      scoringReady,
      compliancePercent,
    },
    rewriteQueue: [...roadmap.requiring_rewrite].sort((left, right) => right.businessValueScore - left.businessValueScore),
    enhancementQueue: [...roadmap.requiring_enhancement].sort((left, right) => right.businessValueScore - left.businessValueScore),
  };
}

export function assessOfficialScript(
  script: { submission: ScriptSubmission; scriptBody: string; scriptPath: string },
  rootDir = process.cwd(),
): ModernizationAssessment {
  const body = script.scriptBody;
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
  const quality = scoreScriptQuality({
    submission: script.submission,
    scriptBody: body,
    features,
  });
  const complexityScore = calculateComplexityScore(body, script.submission);
  const productionReadinessScore = quality.productionReadinessScore;
  const maturity = productionReadinessScore >= 80 ? "acceptable" : productionReadinessScore >= 50 ? "enhancement" : "rewrite";

  return {
    title: script.submission.title,
    slug: script.submission.slug,
    category: script.submission.category,
    path: relative(rootDir, script.scriptPath),
    maturity,
    qualityScore,
    documentationScore: quality.documentationScore,
    operationalMaturityScore: quality.operationalMaturityScore,
    safetyScore: quality.safetyScore,
    testingScore: quality.testingScore,
    maintainabilityScore: quality.maintainabilityScore,
    complexityScore,
    productionReadinessScore,
    certificationLevel: quality.certificationLevel,
    businessValueScore: quality.businessValueScore,
    features,
    requiredActions: getRequiredActions(features, maturity),
    rewriteRecommendation: quality.rewriteRecommendation,
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
- Production readiness combines documentation, operational maturity, safety, testing, and maintainability.
- Certification is assigned automatically from production readiness and required enterprise capabilities.
- Business value prioritizes high-impact MSP categories with the largest readiness gaps.

## Business Value Rewrite Backlog

${formatBacklogTable([...roadmap.requiring_rewrite, ...roadmap.requiring_enhancement].sort((left, right) => right.businessValueScore - left.businessValueScore))}

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

function calculateComplexityScore(scriptBody: string, submission: ScriptSubmission) {
  const lines = scriptBody.split(/\r?\n/).filter((line) => line.trim()).length;
  const parameterWeight = submission.parameters.length * 5;
  const riskWeight = submission.safety.risk_flags.length * 10;
  const moduleWeight = submission.requirements.filter((requirement) => /module|graph|exchange|active directory/i.test(requirement.name)).length * 8;

  return clampScore(Math.round(Math.min(100, lines * 1.2 + parameterWeight + riskWeight + moduleWeight)));
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

function formatBacklogTable(scripts: ModernizationAssessment[]) {
  if (scripts.length === 0) {
    return "No backlog items.\n";
  }

  const rows = scripts.slice(0, 50).map(
    (script, index) =>
      `| ${index + 1} | ${escapeTable(script.title)} | ${script.category} | ${script.businessValueScore} | ${script.productionReadinessScore} | ${escapeTable(script.certificationLevel)} | ${escapeTable(script.rewriteRecommendation)} |`,
  );

  return [
    "| Rank | Script | Category | Business Value | Readiness | Certification | Recommendation |",
    "| ---: | --- | --- | ---: | ---: | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

function buildCategoryAverages(scripts: ModernizationAssessment[]) {
  const groups = new Map<string, ModernizationAssessment[]>();

  for (const script of scripts) {
    groups.set(script.category, [...(groups.get(script.category) ?? []), script]);
  }

  return Array.from(groups.entries())
    .map(([category, categoryScripts]) => ({
      category,
      scriptCount: categoryScripts.length,
      qualityAverage: average(categoryScripts.map((script) => script.qualityScore)),
      safetyAverage: average(categoryScripts.map((script) => script.safetyScore)),
      maturityAverage: average(categoryScripts.map((script) => script.operationalMaturityScore)),
      readinessAverage: average(categoryScripts.map((script) => script.productionReadinessScore)),
    }))
    .sort((left, right) => left.readinessAverage - right.readinessAverage);
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
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
