import type { ScriptSubmission } from "./schema";

/** Public metadata is not authorization to deliver a protected script body.
 * The current OperatorOS auth adapter has no verified tenant/entitlement
 * contract. Until that server authority is implemented, protected content
 * remains unavailable. Local admin/reviewer roles do not imply customer access.
 */
export function canReadPublicScriptBody(submission: ScriptSubmission): boolean {
  return submission.monetization.tier === "free" && submission.monetization.entitlement_required === false;
}
