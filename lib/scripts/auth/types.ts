export type ScriptForgeRole = "scriptforge_admin" | "scriptforge_reviewer" | "scriptforge_contributor";

export type ScriptForgePrincipal = {
  id: string;
  email?: string;
  name?: string;
  roles: ScriptForgeRole[];
};

export interface ScriptForgeAuthAdapter<RequestLike = unknown> {
  authenticate(request: RequestLike, password?: string | null): Promise<ScriptForgePrincipal | null>;
  requireRole(request: RequestLike, roles: ScriptForgeRole[], password?: string | null): Promise<ScriptForgePrincipal>;
}
