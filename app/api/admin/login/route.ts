import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, createUserSessionToken, verifyAdminUserPassword } from "../../../../lib/scripts/admin-users";
import { getRateLimitAdapter } from "../../../../lib/scripts/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");
  const clientKey = getClientRateLimitKey(request);
  const rateLimit = await getRateLimitAdapter().check(`admin-login:${clientKey}:${email || "unknown"}`, 5, 15 * 60_000);

  if (!rateLimit.ok) {
    return NextResponse.json({ error: rateLimit.error ?? "Too many login attempts." }, { status: 429 });
  }

  const user = await verifyAdminUserPassword(email, password);

  if (!user) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const response = NextResponse.json({
    ok: true,
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, createUserSessionToken(user), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}

function getClientRateLimitKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return forwardedFor || request.headers.get("x-real-ip") || "anonymous";
}

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}
