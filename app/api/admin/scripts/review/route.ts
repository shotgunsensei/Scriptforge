import { NextResponse, type NextRequest } from "next/server";
import { isAuthorizedAdminRequest } from "../../../../../lib/scripts/admin-request";
import {
  listPendingCommunityScripts,
  readPendingCommunityScript,
  updatePendingCommunityScript,
} from "../../../../../lib/scripts/review";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Admin session is required." }, { status: 401 });
  }

  const slug = request.nextUrl.searchParams.get("slug");

  try {
    if (slug) {
      const script = await readPendingCommunityScript(slug);

      return NextResponse.json({ script: serializeReviewScript(script) });
    }

    const scripts = await listPendingCommunityScripts();

    return NextResponse.json({ scripts: scripts.map(serializeReviewScript) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load review queue.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();

  if (!(await isAuthorizedAdminRequest(request, body.admin_password))) {
    return NextResponse.json({ error: "Admin session is required." }, { status: 401 });
  }

  try {
    const script = await updatePendingCommunityScript(body);

    return NextResponse.json({ ok: true, script: serializeReviewScript(script) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update script.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

function serializeReviewScript(script: Awaited<ReturnType<typeof readPendingCommunityScript>>) {
  return {
    slug: script.slug,
    folderPath: script.folderPath,
    scriptPath: script.scriptPath,
    metadataPath: script.metadataPath,
    readmePath: script.readmePath,
    scriptBody: script.scriptBody,
    submission: script.submission,
    approvedVersion: script.approvedVersion,
  };
}
