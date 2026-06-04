import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it } from "vitest";
import { GET as getReviewQueue } from "../../app/api/admin/scripts/review/route";
import { GET as getAdminSettings } from "../../app/api/admin/settings/route";
import {
  ADMIN_SESSION_COOKIE,
  createUserSessionToken,
  findAdminUserByEmail,
  seedAdminUser,
  verifyAdminUserPassword,
} from "./admin-users";

const originalUsersRoot = process.env.SCRIPTFORGE_ADMIN_USERS_ROOT;
const originalStorageDriver = process.env.SCRIPT_STORAGE_DRIVER;

afterEach(() => {
  restoreEnv("SCRIPTFORGE_ADMIN_USERS_ROOT", originalUsersRoot);
  restoreEnv("SCRIPT_STORAGE_DRIVER", originalStorageDriver);
});

describe("seeded admin users", () => {
  it("seeds a hashed admin account and authenticates with the correct password", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-admin-"));

    try {
      const result = await seedAdminUser(
        {
          email: "john@shotgunninjas.com",
          password: "temporary-test-password",
          name: "John Williams",
          role: "scriptforge_admin",
        },
        rootDir,
      );
      const stored = await findAdminUserByEmail("john@shotgunninjas.com", rootDir);
      const login = await verifyAdminUserPassword("john@shotgunninjas.com", "temporary-test-password", rootDir);
      const auditFiles = await readdir(join(rootDir, "content", "audit-events"));

      expect(result.created).toBe(true);
      expect(stored?.email).toBe("john@shotgunninjas.com");
      expect(stored?.password_hash).not.toBe("temporary-test-password");
      expect(stored?.password_hash.startsWith("$2")).toBe(true);
      expect(login?.role).toBe("scriptforge_admin");
      expect(auditFiles.some((file) => file.includes("admin_seeded"))).toBe(true);
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("does not authenticate with the wrong password", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-admin-"));

    try {
      await seedAdminUser(
        {
          email: "john@shotgunninjas.com",
          password: "temporary-test-password",
          name: "John Williams",
          role: "scriptforge_admin",
        },
        rootDir,
      );

      await expect(verifyAdminUserPassword("john@shotgunninjas.com", "wrong-password", rootDir)).resolves.toBeNull();
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("returns 401 for unauthenticated admin routes", async () => {
    const response = await getReviewQueue(new NextRequest("http://localhost/api/admin/scripts/review"));

    expect(response.status).toBe(401);
  });

  it("prevents reviewers from accessing admin-only settings", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-admin-"));

    try {
      process.env.SCRIPTFORGE_ADMIN_USERS_ROOT = join(rootDir, "content", "admin-users");
      await seedAdminUser(
        {
          email: "reviewer@example.com",
          password: "temporary-test-password",
          name: "Reviewer",
          role: "scriptforge_reviewer",
        },
        rootDir,
      );
      const user = await findAdminUserByEmail("reviewer@example.com", rootDir);

      if (!user) {
        throw new Error("Missing seeded reviewer.");
      }

      const request = new NextRequest("http://localhost/api/admin/settings", {
        headers: {
          cookie: `${ADMIN_SESSION_COOKIE}=${createUserSessionToken(user)}`,
        },
      });
      const response = await getAdminSettings(request);

      expect(response.status).toBe(401);
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("stores only the password hash on disk", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-admin-"));

    try {
      await seedAdminUser(
        {
          email: "john@shotgunninjas.com",
          password: "temporary-test-password",
          name: "John Williams",
          role: "scriptforge_admin",
        },
        rootDir,
      );
      const usersDir = join(rootDir, "content", "admin-users");
      const files = await readdir(usersDir);
      const raw = await readFile(join(usersDir, files[0]), "utf8");

      expect(raw).toContain("password_hash");
      expect(raw).not.toContain("temporary-test-password");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });
});

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}
