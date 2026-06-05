import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyUserSessionToken } from "../../../lib/scripts/admin-users";
import { buildModernizationDashboardData, type ModernizationAssessment } from "../../../lib/scripts/modernization";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ScriptForge Modernization | OperatorOS",
  description: "Enterprise modernization dashboard for official OperatorOS scripts.",
};

export default async function AdminModernizationPage() {
  const cookieStore = await cookies();
  const principal = await verifyUserSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!principal) {
    redirect("/admin/login");
  }

  const data = await buildModernizationDashboardData();

  return (
    <main className="min-h-screen px-5 py-6 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="border-b border-[#24304A] pb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5E81F4]">
            OperatorOS ScriptForge
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white md:text-4xl">
            Enterprise Modernization
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#94A3B8]">
            Certification, rewrite priority, framework compliance, and category quality posture for the official script catalog.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Official Scripts" value={data.roadmap.official_script_count.toString()} tone="accent" />
          <Metric label="Rewrite Queue" value={data.maturityCounts.rewrite.toString()} tone="warning" />
          <Metric label="Enhancement Queue" value={data.maturityCounts.enhancement.toString()} tone="secondary" />
          <Metric label="Framework Compliance" value={`${data.frameworkCompliance.compliancePercent}%`} tone="accent" />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Panel title="Scripts By Maturity">
            <Bar label="Rewrite" value={data.maturityCounts.rewrite} total={data.roadmap.official_script_count} color="bg-[#E53935]" />
            <Bar label="Enhancement" value={data.maturityCounts.enhancement} total={data.roadmap.official_script_count} color="bg-[#5E81F4]" />
            <Bar label="Acceptable" value={data.maturityCounts.acceptable} total={data.roadmap.official_script_count} color="bg-[#00C896]" />
          </Panel>

          <Panel title="Scripts By Certification">
            {Object.entries(data.certificationCounts).map(([level, count]) => (
              <Bar key={level} label={level.replace("Level ", "L")} value={count} total={data.roadmap.official_script_count} color="bg-[#5E81F4]" />
            ))}
          </Panel>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Panel title="Category Quality Averages">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.14em] text-[#94A3B8]">
                  <tr>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Scripts</th>
                    <th className="pb-3">Quality</th>
                    <th className="pb-3">Safety</th>
                    <th className="pb-3">Maturity</th>
                    <th className="pb-3">Readiness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#24304A] text-slate-200">
                  {data.categoryAverages.map((category) => (
                    <tr key={category.category}>
                      <td className="py-3 font-semibold text-white">{category.category}</td>
                      <td className="py-3">{category.scriptCount}</td>
                      <td className="py-3">{category.qualityAverage}</td>
                      <td className="py-3">{category.safetyAverage}</td>
                      <td className="py-3">{category.maturityAverage}</td>
                      <td className="py-3">{category.readinessAverage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Framework Compliance">
            <div className="space-y-3 text-sm text-slate-300">
              <Checklist label="Imports framework" value={data.frameworkCompliance.importingFramework} total={data.frameworkCompliance.totalScripts} />
              <Checklist label="CmdletBinding" value={data.frameworkCompliance.cmdletBinding} total={data.frameworkCompliance.totalScripts} />
              <Checklist label="HTML/CSV/JSON reporting" value={data.frameworkCompliance.reportingReady} total={data.frameworkCompliance.totalScripts} />
              <Checklist label="Risk and health scoring" value={data.frameworkCompliance.scoringReady} total={data.frameworkCompliance.totalScripts} />
            </div>
          </Panel>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <Queue title="Rewrite Queue" scripts={data.rewriteQueue.slice(0, 12)} />
          <Queue title="Enhancement Queue" scripts={data.enhancementQueue.slice(0, 12)} />
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "accent" | "secondary" | "warning" }) {
  const valueColor = tone === "accent" ? "text-[#00C896]" : tone === "secondary" ? "text-[#5E81F4]" : tone === "warning" ? "text-amber-300" : "text-white";

  return (
    <div className="border border-[#24304A] bg-[#121A2E] p-5 shadow-2xl shadow-black/20">
      <p className="text-xs uppercase tracking-[0.16em] text-[#94A3B8]">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${valueColor}`}>{value}</p>
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

function Bar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percent = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div className="mb-3">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-300">
        <span>{label}</span>
        <span className="font-semibold text-white">{value}</span>
      </div>
      <div className="h-2 bg-[#0B1020]">
        <div className={`h-2 ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Checklist({ label, value, total }: { label: string; value: number; total: number }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-[#24304A] bg-[#0B1020] px-3 py-2">
      <span>{label}</span>
      <span className="font-semibold text-white">
        {value}/{total}
      </span>
    </div>
  );
}

function Queue({ title, scripts }: { title: string; scripts: ModernizationAssessment[] }) {
  return (
    <Panel title={title}>
      <div className="space-y-3">
        {scripts.length === 0 ? (
          <p className="text-sm text-[#94A3B8]">No scripts currently in this queue.</p>
        ) : (
          scripts.map((script) => (
            <article key={`${script.category}-${script.slug}`} className="border border-[#24304A] bg-[#0B1020] p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-white">{script.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#94A3B8]">{script.category}</p>
                </div>
                <div className="text-sm font-semibold text-[#00C896]">Value {script.businessValueScore}</div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{script.rewriteRecommendation}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="border border-[#24304A] px-2 py-1">Readiness {script.productionReadinessScore}</span>
                <span className="border border-[#24304A] px-2 py-1">{script.certificationLevel}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </Panel>
  );
}
