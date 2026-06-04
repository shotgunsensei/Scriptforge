import type { NextRequest } from "next/server";
import { getAuthAdapter } from "./auth";
import type { ScriptForgeRole } from "./auth/types";

export async function isAuthorizedAdminRequest(
  request: NextRequest,
  adminPassword?: string | null,
  roles: ScriptForgeRole[] = ["scriptforge_admin", "scriptforge_reviewer"],
): Promise<boolean> {
  try {
    await getAuthAdapter().requireRole(request, roles, adminPassword);

    return true;
  } catch {
    return false;
  }
}
