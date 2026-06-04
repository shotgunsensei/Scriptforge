import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyUserSessionToken } from "../../../../lib/scripts/admin-users";
import { AdminScriptReviewClient } from "./review-client";
import { ProductionStorageWarning } from "../storage-warning";

export const dynamic = "force-dynamic";

export default async function AdminScriptReviewPage() {
  const cookieStore = await cookies();
  const principal = await verifyUserSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!principal) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen px-5 py-6 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="border-b border-slate-800 pb-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-300">
                OperatorOS ScriptForge
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white md:text-4xl">
                Community Script Review
              </h1>
            </div>
            <div className="rounded border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
              Pending community scripts can be approved, rejected, marked for changes, or promoted.
            </div>
          </div>
        </header>

        <AdminScriptReviewClient isAuthenticated={true} />
        <ProductionStorageWarning />
      </div>
    </main>
  );
}
