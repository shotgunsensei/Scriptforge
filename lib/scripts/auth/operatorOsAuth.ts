import type { NextRequest } from "next/server";
import type { ScriptForgeAuthAdapter, ScriptForgePrincipal, ScriptForgeRole } from "./types";

export class OperatorOsSsoAuthAdapter implements ScriptForgeAuthAdapter<NextRequest> {
  async authenticate(_request: NextRequest): Promise<ScriptForgePrincipal | null> {
    throw new Error("OperatorOS SSO adapter placeholder. Wire SSO claims and RBAC before OPERATOROS_AUTH_MODE=sso.");
  }

  async requireRole(
    request: NextRequest,
    roles: ScriptForgeRole[],
  ): Promise<ScriptForgePrincipal> {
    const principal = await this.authenticate(request);

    if (!principal || !roles.some((role) => principal.roles.includes(role))) {
      throw new Error("Required OperatorOS role is missing.");
    }

    return principal;
  }
}
