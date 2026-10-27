import { createHmac } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createUserSessionToken, seedAdminUser, verifyUserSessionToken } from "./admin-users";

const keys = ["NODE_ENV", "SCRIPTFORGE_SESSION_SECRET", "SCRIPTFORGE_ADMIN_SEED_PASSWORD", "ADMIN_SUBMISSION_PASSWORD"] as const;
const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));
afterEach(() => { for (const key of keys) { if (original[key] === undefined) delete process.env[key]; else process.env[key] = original[key]; } });
const fixtureSecret = "synthetic-only-session-key-for-regression-fixture";
function noConfiguredKeys() { for (const key of keys.slice(1)) delete process.env[key]; }
async function fixture() {
 const root = await mkdtemp(join(tmpdir(), "scriptforge-session-security-"));
 const { user } = await seedAdminUser({ email: "security-fixture@example.test", password: "synthetic-test-password", name: "Synthetic fixture", role: "scriptforge_admin" }, root);
 return { root, user };
}

describe("production admin session signing", () => {
 it("rejects public development-key sessions and refuses issuance without configured production signing", async () => {
  noConfiguredKeys(); process.env.NODE_ENV = "test";
  const {root,user} = await fixture();
  try {
   const developmentToken = createUserSessionToken(user);
   process.env.NODE_ENV = "production";
   expect(await verifyUserSessionToken(developmentToken,root)).toBeNull();
   expect(() => createUserSessionToken(user)).toThrow(/SCRIPTFORGE_SESSION_SECRET/);
  } finally { await rm(root,{recursive:true,force:true}); }
 });
 it("accepts explicit dedicated signing with existing authority revalidation", async () => {
  noConfiguredKeys(); process.env.NODE_ENV = "production"; process.env.SCRIPTFORGE_SESSION_SECRET = fixtureSecret;
  const {root,user} = await fixture();
  try { expect(await verifyUserSessionToken(createUserSessionToken(user),root)).toMatchObject({id:user.id,roles:["scriptforge_admin"]}); }
  finally { await rm(root,{recursive:true,force:true}); }
 });
 it("does not downgrade an invalid explicit key to a configured legacy password", async () => {
  noConfiguredKeys(); process.env.NODE_ENV = "production"; process.env.SCRIPTFORGE_SESSION_SECRET = "short"; process.env.ADMIN_SUBMISSION_PASSWORD = fixtureSecret;
  const {root,user} = await fixture();
  try { expect(() => createUserSessionToken(user)).toThrow(/SCRIPTFORGE_SESSION_SECRET/); }
  finally { await rm(root,{recursive:true,force:true}); }
 });
 it("rejects malformed signed expiry and extra token segments", async () => {
  noConfiguredKeys(); process.env.NODE_ENV = "production"; process.env.SCRIPTFORGE_SESSION_SECRET = fixtureSecret;
  const {root,user} = await fixture();
  try {
   const token = createUserSessionToken(user);
   expect(await verifyUserSessionToken(token+".extra",root)).toBeNull();
   const data = JSON.parse(Buffer.from(token.split(".")[0],"base64url").toString("utf8"));
   data.exp = "not-a-timestamp";
   const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
   const signature = createHmac("sha256",fixtureSecret).update(payload).digest("base64url");
   expect(await verifyUserSessionToken(payload+"."+signature,root)).toBeNull();
  } finally { await rm(root,{recursive:true,force:true}); }
 });
});
