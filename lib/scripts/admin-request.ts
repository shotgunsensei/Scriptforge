import type { NextRequest } from "next/server";
import { getAuthAdapter } from "./auth";
import type { ScriptForgePrincipal } from "./auth/types";
import type { ScriptForgeRole } from "./auth/types";

export async function isAuthorizedAdminRequest(
  request: NextRequest,
  adminPassword?: string | null,
  roles: ScriptForgeRole[] = ["scriptforge_admin", "scriptforge_reviewer"],
): Promise<boolean> {
  try {
    await getAuthorizedAdminPrincipal(request, adminPassword, roles);

    return true;
  } catch {
    return false;
  }
}

export async function getAuthorizedAdminPrincipal(
  request: NextRequest,
  adminPassword?: string | null,
  roles: ScriptForgeRole[] = ["scriptforge_admin", "scriptforge_reviewer"],
): Promise<ScriptForgePrincipal> {
  return getAuthAdapter().requireRole(request, roles, adminPassword);
}
