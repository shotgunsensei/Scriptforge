import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { join } from "node:path";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { logAdminAuditEvent } from "./audit";
import type { ScriptForgePrincipal, ScriptForgeRole } from "./auth/types";
import { createSupabaseServiceClient } from "./supabase";

export const adminUserSchema = z.object({
  id: z.string().trim().min(1),
  email: z.string().email(),
  name: z.string().trim().min(1),
  role: z.enum(["scriptforge_admin", "scriptforge_reviewer", "scriptforge_contributor"]),
  password_hash: z.string().trim().min(20),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export type AdminUser = z.infer<typeof adminUserSchema>;

export type SeedAdminInput = {
  email: string;
  password: string;
  name: string;
  role: ScriptForgeRole;
};

export const ADMIN_SESSION_COOKIE = "scriptforge_admin_session";

const SESSION_VERSION = "v1";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

export function getAdminSeedConfig() {
  return {
    email: process.env.SCRIPTFORGE_ADMIN_EMAIL?.trim() || "john@shotgunninjas.com",
    password: process.env.SCRIPTFORGE_ADMIN_SEED_PASSWORD ?? "",
    name: process.env.SCRIPTFORGE_ADMIN_NAME?.trim() || "John Williams",
    role: parseRole(process.env.SCRIPTFORGE_ADMIN_ROLE),
  };
}

export async function seedAdminUser(input: SeedAdminInput, rootDir = process.cwd()) {
  const existing = await findAdminUserByEmail(input.email, rootDir);

  if (existing) {
    return { user: existing, created: false };
  }

  const now = new Date().toISOString();
  const user = adminUserSchema.parse({
    id: createAdminUserId(input.email),
    email: input.email.toLowerCase(),
    name: input.name,
    role: input.role,
    password_hash: await bcrypt.hash(input.password, 12),
    created_at: now,
    updated_at: now,
  });

  await writeAdminUser(user, rootDir);
  await logAdminAuditEvent({
    type: "admin_seeded",
    actor: user.email,
    notes: `Seeded ${user.role} account.`,
    rootDir,
  });

  return { user, created: true };
}

export async function findAdminUserByEmail(email: string, rootDir = process.cwd()): Promise<AdminUser | null> {
  if (useDatabaseAdminUsers(rootDir)) {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("script_admin_users")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return adminUserSchema.parse(data);
  }

  const userPath = getAdminUserPath(rootDir, email);

  try {
    return adminUserSchema.parse(JSON.parse(await readFile(userPath, "utf8")));
  } catch {
    return null;
  }
}

export async function listAdminUsers(rootDir = process.cwd()): Promise<AdminUser[]> {
  if (useDatabaseAdminUsers(rootDir)) {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase.from("script_admin_users").select("*").order("email", { ascending: true });

    if (error) {
      throw new Error(`Failed to list admin users: ${error.message}`);
    }

    return (data ?? []).map((user) => adminUserSchema.parse(user));
  }

  const usersDir = getAdminUsersDir(rootDir);

  try {
    const files = await readdir(usersDir);
    const users = await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => adminUserSchema.parse(JSON.parse(await readFile(join(usersDir, file), "utf8")))),
    );

    return users.sort((left, right) => left.email.localeCompare(right.email));
  } catch {
    return [];
  }
}

export async function writeAdminUser(user: AdminUser, rootDir = process.cwd()) {
  if (useDatabaseAdminUsers(rootDir)) {
    const supabase = createSupabaseServiceClient();
    const { error } = await supabase.from("script_admin_users").upsert(user, { onConflict: "email" });

    if (error) {
      throw new Error(`Failed to write admin user: ${error.message}`);
    }

    return;
  }

  const usersDir = getAdminUsersDir(rootDir);
  await mkdir(usersDir, { recursive: true });
  await writeFile(getAdminUserPath(rootDir, user.email), `${JSON.stringify(user, null, 2)}\n`, "utf8");
}

function useDatabaseAdminUsers(rootDir: string) {
  return process.env.SCRIPT_STORAGE_DRIVER === "database" && rootDir === process.cwd();
}

export async function verifyAdminUserPassword(email: string, password: string, rootDir = process.cwd()) {
  const user = await findAdminUserByEmail(email, rootDir);

  if (!user || !password) {
    return null;
  }

  const ok = await bcrypt.compare(password, user.password_hash);

  return ok ? user : null;
}

export function createUserSessionToken(user: AdminUser, now = Date.now()): string {
  const expiresAt = now + SESSION_TTL_MS;
  const payload = Buffer.from(
    JSON.stringify({
      v: SESSION_VERSION,
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: expiresAt,
    }),
  ).toString("base64url");
  const signature = signSessionPayload(payload);

  return `${payload}.${signature}`;
}

export async function verifyUserSessionToken(
  token: string | null | undefined,
  rootDir = process.cwd(),
): Promise<ScriptForgePrincipal | null> {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature || !safeEqual(signature, signSessionPayload(payload))) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      v?: string;
      sub?: string;
      email?: string;
      role?: ScriptForgeRole;
      exp?: number;
    };

    if (decoded.v !== SESSION_VERSION || !decoded.email || !decoded.role || !decoded.exp || decoded.exp <= Date.now()) {
      return null;
    }

    const user = await findAdminUserByEmail(decoded.email, rootDir);

    if (!user || user.id !== decoded.sub || user.role !== decoded.role) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: [user.role],
    };
  } catch {
    return null;
  }
}

export function hasRequiredRole(userRoles: ScriptForgeRole[], requiredRoles: ScriptForgeRole[]) {
  if (userRoles.includes("scriptforge_admin")) {
    return true;
  }

  return requiredRoles.some((role) => userRoles.includes(role));
}

function getAdminUsersDir(rootDir: string) {
  const overrideRoot = process.env.SCRIPTFORGE_ADMIN_USERS_ROOT;

  if (overrideRoot && rootDir === process.cwd()) {
    return overrideRoot;
  }

  return join(rootDir, "content", "admin-users");
}

function getAdminUserPath(rootDir: string, email: string) {
  return join(getAdminUsersDir(rootDir), `${createAdminUserId(email)}.json`);
}

function createAdminUserId(email: string) {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 24);
}

function parseRole(role: string | undefined): ScriptForgeRole {
  if (role === "scriptforge_reviewer" || role === "scriptforge_contributor") {
    return role;
  }

  return "scriptforge_admin";
}

function signSessionPayload(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function getSessionSecret(): string {
  const seedPassword = process.env.SCRIPTFORGE_ADMIN_SEED_PASSWORD;
  const fallbackPassword = process.env.ADMIN_SUBMISSION_PASSWORD;

  if (seedPassword) {
    return seedPassword;
  }

  if (fallbackPassword && fallbackPassword !== "change-this-password") {
    return fallbackPassword;
  }

  return "scriptforge-dev-session-secret";
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}
