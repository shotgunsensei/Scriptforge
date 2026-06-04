import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "scriptforge_admin_session";

const SESSION_VALUE = "scriptforge-admin";

export function getAdminPassword(): string | null {
  const password = process.env.ADMIN_SUBMISSION_PASSWORD?.trim();

  if (!password || password === "change-this-password") {
    return null;
  }

  return password;
}

export function verifyAdminPassword(input: string | null | undefined): boolean {
  const password = getAdminPassword();

  if (!password || !input) {
    return false;
  }

  return safeEqual(input, password);
}

export function createAdminSessionToken(): string {
  const password = getAdminPassword();

  if (!password) {
    throw new Error("ADMIN_SUBMISSION_PASSWORD must be set to a non-default value.");
  }

  return signValue(SESSION_VALUE, password);
}

export function verifyAdminSessionToken(token: string | null | undefined): boolean {
  const password = getAdminPassword();

  if (!password || !token) {
    return false;
  }

  return safeEqual(token, signValue(SESSION_VALUE, password));
}

function signValue(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}
