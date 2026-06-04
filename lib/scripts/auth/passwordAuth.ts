import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminPassword, verifyAdminSessionToken } from "../admin-auth";
import type { ScriptForgeAuthAdapter, ScriptForgePrincipal, ScriptForgeRole } from "./types";

export class PasswordAuthAdapter implements ScriptForgeAuthAdapter<NextRequest> {
  async authenticate(request: NextRequest, password?: string | null): Promise<ScriptForgePrincipal | null> {
    const authorized =
      verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value) ||
      verifyAdminPassword(password) ||
      verifyAdminPassword(request.headers.get("x-admin-submission-password"));

    if (!authorized) {
      return null;
    }

    return {
      id: "password-admin",
      roles: ["scriptforge_admin", "scriptforge_reviewer", "scriptforge_contributor"],
    };
  }

  async requireRole(
    request: NextRequest,
    roles: ScriptForgeRole[],
    password?: string | null,
  ): Promise<ScriptForgePrincipal> {
    const principal = await this.authenticate(request, password);

    if (!principal || !roles.some((role) => principal.roles.includes(role))) {
      throw new Error("Admin session is required.");
    }

    return principal;
  }
}
