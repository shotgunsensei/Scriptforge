import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyUserSessionToken } from "../../../lib/scripts/admin-users";
import { getScriptForgeSystemStatus } from "../../../lib/scripts/system-status";
import { ProductionStorageWarning } from "../scripts/storage-warning";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ScriptForge Command Center | OperatorOS",
  description: "System visibility dashboard for OperatorOS ScriptForge.",
};

export default async function AdminSystemPage() {
  const cookieStore = await cookies();
  const principal = await verifyUserSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!principal) {
    redirect("/admin/login");
  }

  const status = await getScriptForgeSystemStatus();

  return (
    <main className="min-h-screen px-5 py-6 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="border-b border-[#24304A] pb-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5E81F4]">
                OperatorOS ScriptForge
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white md:text-4xl">
                ScriptForge Command Center
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#94A3B8]">
                Production visibility for catalog indexing, community intake, review queue health, and storage posture.
              </p>
            </div>
            <div
              className={`border px-4 py-3 text-sm font-semibold ${
                status.healthStatus === "healthy"
                  ? "border-[#00C896] bg-emerald-950/30 text-emerald-100"
                  : "border-amber-600 bg-amber-950/30 text-amber-100"
              }`}
            >
              {status.healthStatus === "healthy" ? "Healthy" : "Degraded"}
            </div>
          </div>
        </header>

        <ProductionStorageWarning />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Scripts Indexed" value={formatNumber(status.scriptsIndexed)} tone="accent" />
          <Metric label="Pending Reviews" value={formatNumber(status.pendingReviews)} tone="secondary" />
          <Metric label="Community Uploads" value={formatNumber(status.communityUploads)} tone="secondary" />
          <Metric label="Storage Driver" value={status.storageDriver} tone={status.storageDriver === "database" ? "accent" : "warning"} />
          <Metric label="Build Version" value={status.buildVersion} />
          <Metric label="Health Status" value={status.healthStatus} tone={status.healthStatus === "healthy" ? "accent" : "warning"} />
          <Metric label="Last Index Rebuild" value={formatDate(status.lastIndexRebuild)} />
          <Metric label="Database" value={formatDatabase(status.databaseOk)} tone={status.databaseOk === false ? "warning" : "default"} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Panel title="System Notes">
            <div className="grid gap-3 text-sm leading-6 text-slate-300">
              <p>{status.healthMessage}</p>
              <p>
                Index status:{" "}
                <span className={status.indexOk ? "font-semibold text-[#00C896]" : "font-semibold text-amber-300"}>
                  {status.indexOk ? "available" : "needs attention"}
                </span>
              </p>
              <p>
                Signed in as <span className="font-semibold text-white">{principal.email ?? principal.id}</span>.
              </p>
            </div>
          </Panel>

          <Panel title="Production Checklist">
            <ul className="space-y-2 text-sm leading-6 text-slate-300">
              <ChecklistItem done={!status.productionLocalStorageWarning} label="Durable storage enabled" />
              <ChecklistItem done={status.indexOk} label="Search index available" />
              <ChecklistItem done={status.healthStatus === "healthy"} label="Health checks passing" />
              <ChecklistItem done={status.databaseOk !== false} label="Database reachable when required" />
            </ul>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent" | "secondary" | "warning";
}) {
  const valueColor =
    tone === "accent"
      ? "text-[#00C896]"
      : tone === "secondary"
        ? "text-[#5E81F4]"
        : tone === "warning"
          ? "text-amber-300"
          : "text-[#F8FAFC]";

  return (
    <div className="border border-[#24304A] bg-[#121A2E] p-5 shadow-2xl shadow-black/20">
      <p className="text-xs uppercase tracking-[0.16em] text-[#94A3B8]">{label}</p>
      <p className={`mt-3 break-words text-2xl font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
}

function Panel({ title, children }: Readonly<{ title: string; children: ReactNode }>) {
  return (
    <section className="border border-[#24304A] bg-[#121A2E] p-5 shadow-2xl shadow-black/20">
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center justify-between gap-3 border border-[#24304A] bg-[#0B1020] px-3 py-2">
      <span>{label}</span>
      <span className={done ? "font-semibold text-[#00C896]" : "font-semibold text-amber-300"}>
        {done ? "OK" : "Check"}
      </span>
    </li>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDate(value: string | null) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDatabase(value: boolean | null) {
  if (value === null) {
    return "Skipped";
  }

  return value ? "Connected" : "Failed";
}
