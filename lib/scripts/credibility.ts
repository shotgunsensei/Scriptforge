import type { ScriptSubmission } from "./schema";

export type ScriptCredibility = {
  last_reviewed: string | null;
  last_tested: string | null;
  powershell_compatibility: string[];
  safety_score: number;
  documentation_score: number;
  community_rating: number | null;
  download_count: number;
};

export function deriveScriptCredibility(submission: ScriptSubmission): ScriptCredibility {
  return {
    last_reviewed: submission.reviewed_at,
    last_tested: submission.last_tested_at ?? defaultLastTested(submission),
    powershell_compatibility: submission.powershell_compatibility ?? ["Windows PowerShell 5.1", "PowerShell 7"],
    safety_score: submission.safety_score ?? deriveSafetyScore(submission),
    documentation_score: submission.documentation_score ?? deriveDocumentationScore(submission),
    community_rating: submission.community_rating ?? null,
    download_count: submission.download_count ?? 0,
  };
}

export function deriveSafetyScore(submission: ScriptSubmission): number {
  const riskPenalty = {
    low: 0,
    medium: 18,
    high: 38,
    critical: 65,
  }[submission.safety.risk_level];
  const flagPenalty = Math.min(submission.safety.risk_flags.length * 5, 20);
  const scanPenalty = submission.safety.scan_status === "passed" ? 0 : submission.safety.scan_status === "warnings" ? 10 : 30;

  return Math.max(0, 100 - riskPenalty - flagPenalty - scanPenalty);
}

export function deriveDocumentationScore(submission: ScriptSubmission): number {
  const checks = [
    submission.summary.length > 40,
    submission.description.length > 80,
    submission.use_case.length > 40,
    submission.requirements.length > 0,
    submission.examples.length > 0,
    Boolean(submission.documentation.readme),
    Boolean(submission.documentation.changelog),
  ];
  const passed = checks.filter(Boolean).length;

  return Math.round((passed / checks.length) * 100);
}

function defaultLastTested(submission: ScriptSubmission): string | null {
  if (submission.source_type !== "operatoros") {
    return null;
  }

  return "2026-06-01T00:00:00.000Z";
}
