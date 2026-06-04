import { NextResponse, type NextRequest } from "next/server";
import { isAuthorizedAdminRequest } from "../../../../../lib/scripts/admin-request";
import { rejectCommunityScript } from "../../../../../lib/scripts/review";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!(await isAuthorizedAdminRequest(request, body.admin_password))) {
    return NextResponse.json({ error: "Admin session is required." }, { status: 401 });
  }

  try {
    const script = await rejectCommunityScript(body);

    return NextResponse.json({ ok: true, script });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reject script.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
