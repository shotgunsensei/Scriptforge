import type { ModernizationFeatureMap } from "./modernization";
import type { ScriptSubmission } from "./schema";

export type CertificationLevel =
  | "Level 1: Basic Utility"
  | "Level 2: Technician Ready"
  | "Level 3: MSP Ready"
  | "Level 4: Enterprise Ready"
  | "Level 5: OperatorOS Certified";

export type ScriptQualityScore = {
  documentationScore: number;
  operationalMaturityScore: number;
  safetyScore: number;
  testingScore: number;
  maintainabilityScore: number;
  productionReadinessScore: number;
  certificationLevel: CertificationLevel;
  certificationGate: {
    documentationPass: boolean;
    safetyPass: boolean;
    readinessPass: boolean;
    testCoveragePass: boolean;
    frameworkCompliancePass: boolean;
    operatorOsCertifiedEligible: boolean;
  };
  businessValueScore: number;
  rewriteRecommendation: string;
};

export type ScriptQualityInput = {
  submission: ScriptSubmission;
  scriptBody: string;
  features: ModernizationFeatureMap;
};

export function scoreScriptQuality(input: ScriptQualityInput): ScriptQualityScore {
  const documentationScore = scoreDocumentation(input.submission);
  const operationalMaturityScore = scoreOperationalMaturity(input.features);
  const safetyScore = scoreSafety(input);
  const testingScore = scoreTesting(input);
  const maintainabilityScore = scoreMaintainability(input);
  const productionReadinessScore = clampScore(
    Math.round(
      documentationScore * 0.18 +
        operationalMaturityScore * 0.28 +
        safetyScore * 0.22 +
        testingScore * 0.12 +
        maintainabilityScore * 0.2,
    ),
  );
  const businessValueScore = scoreBusinessValue(input.submission, productionReadinessScore);
  const certificationGate = buildCertificationGate(input, {
    documentationScore,
    safetyScore,
    productionReadinessScore,
  });

  return {
    documentationScore,
    operationalMaturityScore,
    safetyScore,
    testingScore,
    maintainabilityScore,
    productionReadinessScore,
    certificationLevel: certifyScript(productionReadinessScore, input.features, certificationGate),
    certificationGate,
    businessValueScore,
    rewriteRecommendation: recommendRewrite(input, productionReadinessScore),
  };
}

export function certifyScript(
  score: number,
  features: ModernizationFeatureMap,
  gate?: ScriptQualityScore["certificationGate"],
): CertificationLevel {
  if (
    score >= 90 &&
    gate?.operatorOsCertifiedEligible === true &&
    features.frameworkImport &&
    features.tryCatch &&
    features.whatIf &&
    features.dryRun &&
    features.htmlReport &&
    features.csvExport &&
    features.jsonExport &&
    features.operatorSummary &&
    features.riskScoring &&
    features.healthScoring &&
    features.evidenceCollection
  ) {
    return "Level 5: OperatorOS Certified";
  }

  if (score >= 80 && features.frameworkImport && features.tryCatch && features.operatorSummary) {
    return "Level 4: Enterprise Ready";
  }

  if (score >= 65 && features.frameworkImport && features.structuredLogging) {
    return "Level 3: MSP Ready";
  }

  if (score >= 45 && features.frameworkImport) {
    return "Level 2: Technician Ready";
  }

  return "Level 1: Basic Utility";
}

function buildCertificationGate(
  input: ScriptQualityInput,
  scores: { documentationScore: number; safetyScore: number; productionReadinessScore: number },
) {
  const frameworkCompliancePass =
    input.features.frameworkImport &&
    input.features.cmdletBinding &&
    input.features.tryCatch &&
    input.features.structuredLogging &&
    input.features.htmlReport &&
    input.features.csvExport &&
    input.features.jsonExport &&
    input.features.operatorSummary &&
    input.features.riskScoring &&
    input.features.healthScoring;
  const testCoveragePass = Boolean(input.submission.last_tested || input.submission.last_tested_at) && /Pester|Describe\s+["']|It\s+["']|Invoke-Pester/i.test(input.scriptBody);
  const documentationPass = scores.documentationScore >= 90;
  const safetyPass = scores.safetyScore >= 90;
  const readinessPass = scores.productionReadinessScore >= 90;

  return {
    documentationPass,
    safetyPass,
    readinessPass,
    testCoveragePass,
    frameworkCompliancePass,
    operatorOsCertifiedEligible: documentationPass && safetyPass && readinessPass && testCoveragePass && frameworkCompliancePass,
  };
}

function scoreDocumentation(submission: ScriptSubmission) {
  let score = 0;

  if (submission.summary.length >= 40) score += 15;
  if (submission.description.length >= 120) score += 20;
  if (submission.use_case.length >= 80) score += 15;
  if (submission.requirements.length > 0) score += 12;
  if (submission.parameters.every((parameter) => parameter.description)) score += 8;
  if (submission.examples.length > 0) score += 10;
  if (submission.output.description) score += 8;
  if (submission.documentation.changelog) score += 7;
  if (submission.documentation.references.length > 0) score += 5;

  return clampScore(score);
}

function scoreOperationalMaturity(features: ModernizationFeatureMap) {
  const weightedFeatures: Array<[keyof ModernizationFeatureMap, number]> = [
    ["frameworkImport", 8],
    ["cmdletBinding", 7],
    ["structuredLogging", 8],
    ["tryCatch", 8],
    ["whatIf", 6],
    ["dryRun", 6],
    ["rollback", 6],
    ["htmlReport", 5],
    ["csvExport", 5],
    ["jsonExport", 5],
    ["operatorSummary", 7],
    ["riskScoring", 6],
    ["healthScoring", 6],
    ["executionTiming", 5],
    ["exceptionTracking", 5],
    ["permissionValidation", 5],
    ["moduleDependencyValidation", 4],
    ["evidenceCollection", 3],
  ];

  return clampScore(weightedFeatures.reduce((score, [feature, weight]) => score + (features[feature] ? weight : 0), 0));
}

function scoreSafety(input: ScriptQualityInput) {
  const lowered = input.scriptBody.toLowerCase();
  let score = input.submission.safety.risk_level === "low" ? 55 : input.submission.safety.risk_level === "medium" ? 45 : 30;

  if (input.features.frameworkImport) score += 8;
  if (input.features.whatIf) score += 8;
  if (input.features.dryRun) score += 7;
  if (input.features.rollback) score += 7;
  if (input.features.permissionValidation) score += 5;
  if (input.features.tryCatch) score += 5;
  if (input.features.exceptionTracking) score += 5;
  if (/remove-item|set-executionpolicy|invoke-expression|\biex\b|encodedcommand|new-service|new-scheduledtask/.test(lowered)) score -= 20;

  return clampScore(score);
}

function scoreTesting(input: ScriptQualityInput) {
  let score = 20;

  if (input.submission.last_tested_at || input.submission.last_tested) score += 25;
  if (input.submission.powershell_compatibility?.length) score += 20;
  if (/Assert-|Test-|Pester|ShouldProcess|DryRun/i.test(input.scriptBody)) score += 20;
  if (input.features.jsonExport && input.features.operatorSummary) score += 15;

  return clampScore(score);
}

function scoreMaintainability(input: ScriptQualityInput) {
  const lines = input.scriptBody.split(/\r?\n/).filter((line) => line.trim()).length;
  let score = 35;

  if (input.features.frameworkImport) score += 15;
  if (input.features.cmdletBinding) score += 10;
  if (input.features.moduleDependencyValidation) score += 10;
  if (input.features.structuredLogging) score += 10;
  if (input.submission.parameters.every((parameter) => parameter.description)) score += 10;
  if (lines >= 40 && lines <= 240) score += 10;
  if (lines < 15) score -= 20;

  return clampScore(score);
}

function scoreBusinessValue(submission: ScriptSubmission, productionReadinessScore: number) {
  const categoryWeight: Record<string, number> = {
    "microsoft-365": 95,
    "exchange-online": 90,
    "entra-id": 94,
    "active-directory": 88,
    security: 92,
    "windows-server": 82,
    "workstation-repair": 78,
    networking: 76,
    "kaseya-datto-rmm": 86,
  };
  const riskLift = submission.safety.requires_admin || submission.safety.risk_flags.length > 0 ? 8 : 0;
  const readinessGap = 100 - productionReadinessScore;

  return clampScore(Math.round((categoryWeight[submission.category] ?? 70) * 0.55 + readinessGap * 0.35 + riskLift));
}

function recommendRewrite(input: ScriptQualityInput, productionReadinessScore: number) {
  if (productionReadinessScore < 45) {
    return "Rewrite against the matching enterprise archetype before positioning as official production automation.";
  }

  if (!input.features.operatorSummary || !input.features.htmlReport || !input.features.jsonExport) {
    return "Enhance with operator summary, evidence capture, and report exports before MSP production rollout.";
  }

  if (!input.features.permissionValidation || !input.features.moduleDependencyValidation) {
    return "Add dependency and permission validation before broad technician use.";
  }

  return "Maintain as certified baseline and schedule periodic tenant/module compatibility review.";
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}
