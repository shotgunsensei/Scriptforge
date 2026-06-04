import { NextResponse, type NextRequest } from "next/server";
import { isAuthorizedAdminRequest } from "../../../../lib/scripts/admin-request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request, null, ["scriptforge_admin"]))) {
    return NextResponse.json({ error: "ScriptForge admin role is required." }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    settings: {
      storage_driver: process.env.SCRIPT_STORAGE_DRIVER ?? "local",
      auth_mode: process.env.OPERATOROS_AUTH_MODE ?? "password",
    },
  });
}
