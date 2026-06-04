import { NextResponse, type NextRequest } from "next/server";
import { isAuthorizedAdminRequest } from "../../../../../lib/scripts/admin-request";
import { promoteCommunityScript } from "../../../../../lib/scripts/review";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!(await isAuthorizedAdminRequest(request, body.admin_password, ["scriptforge_admin"]))) {
    return NextResponse.json({ error: "Admin session is required." }, { status: 401 });
  }

  try {
    const result = await promoteCommunityScript(body);

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to promote script.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
