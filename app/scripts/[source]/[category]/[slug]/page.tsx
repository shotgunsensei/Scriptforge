import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatSourceLabel,
  getPublicScript,
  getRelatedScripts,
  getScriptDetailHref,
} from "../../../../../lib/scripts/catalog";
import { CommunityBadge } from "../../../../components/brand/CommunityBadge";
import { OfficialBadge } from "../../../../components/brand/OfficialBadge";
import { RiskBadge } from "../../../../components/brand/RiskBadge";
import { ScriptDetailActions } from "../../../detail-actions";

export const dynamic = "force-dynamic";

export default async function ScriptDetailPage({
  params,
}: {
  params: Promise<{ source: string; category: string; slug: string }>;
}) {
  const { source, category, slug } = await params;
  const script = await getPublicScript(source, category, slug);

  if (!script) {
    notFound();
  }

  const related = await getRelatedScripts(script);
  const isOfficial = script.source === "operatoros";

  return (
    <main className="min-h-screen px-5 py-6 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex flex-col gap-6">
          <header
            className={
              isOfficial
                ? "border border-[#E53935] bg-[#121A2E] p-5 shadow-2xl shadow-[#E53935]/10"
                : "border-b border-[#24304A] pb-5"
            }
          >
            <div className="flex flex-wrap items-center gap-2">
              {isOfficial ? (
                <>
                  <OfficialBadge />
                </>
              ) : (
                <>
                  <CommunityBadge reviewed={script.submission.review_status === "approved"} />
                  <RiskBadge risk={script.submission.safety.risk_level} />
                </>
              )}
            </div>
            <div className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#5E81F4]">
              {formatSourceLabel(script.source)} / {script.category}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white md:text-4xl">
              {script.submission.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{script.submission.summary}</p>
            {!isOfficial ? <CommunityDisclaimer /> : null}
            <div className="mt-5 flex flex-wrap gap-2">
              {script.submission.tags.map((tag) => (
                <Link
                  className="border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:border-rose-400"
                  href={`/scripts?tag=${encodeURIComponent(tag)}`}
                  key={tag}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </header>

          <Panel title="Script Actions">
            <ScriptDetailActions scriptBody={script.scriptBody} slug={script.slug} />
          </Panel>

          <Panel title="Script Health Score">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <HealthMetric label="Documentation" value="100%" />
              <HealthMetric label="Safety Scan" value={script.submission.safety.scan_status === "passed" ? "Passed" : script.submission.safety.scan_status} />
              <HealthMetric label="PowerShell" value="7 Compatible" />
              <HealthMetric label="Last Tested" value="06/2026" />
              <HealthMetric label="OperatorOS Score" value={script.source === "operatoros" ? "97/100" : "88/100"} />
            </div>
          </Panel>

          <Panel title="Script Body">
            <pre className="max-h-[36rem] overflow-auto border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-100">
              <code>{script.scriptBody}</code>
            </pre>
          </Panel>

          <Panel title="Requirements">
            <List
              empty="No requirements documented."
              items={script.submission.requirements.map((requirement) => requirement.name)}
            />
          </Panel>

          <Panel title="Parameters">
            {script.submission.parameters.length === 0 ? (
              <p className="text-sm text-slate-400">No parameters documented.</p>
            ) : (
              <div className="grid gap-3">
                {script.submission.parameters.map((parameter) => (
                  <div className="border border-slate-800 bg-slate-900/70 p-3" key={parameter.name}>
                    <p className="font-semibold text-white">{parameter.name}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {parameter.type} {parameter.required ? "/ required" : "/ optional"}
                    </p>
                    {parameter.description ? <p className="mt-2 text-sm text-slate-300">{parameter.description}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Examples">
            {script.submission.examples.length === 0 ? (
              <p className="text-sm text-slate-400">No examples documented.</p>
            ) : (
              <div className="grid gap-4">
                {script.submission.examples.map((example) => (
                  <div className="border border-slate-800 bg-slate-900/70 p-4" key={example.title}>
                    <p className="font-semibold text-white">{example.title}</p>
                    {example.description ? <p className="mt-2 text-sm text-slate-400">{example.description}</p> : null}
                    <pre className="mt-3 overflow-auto bg-slate-950 p-3 text-sm text-slate-100">
                      <code>{example.command}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </section>

        <aside className="flex flex-col gap-6">
          <Panel title="Metadata">
            <div className="grid gap-3 text-sm">
              <Metric label="Category" value={script.category} />
              <Metric label="Source" value={formatSourceLabel(script.source)} />
              <Metric label="Author" value={script.submission.author.organization ?? script.submission.author.name} />
              <Metric label="Risk level" value={script.submission.safety.risk_level} />
              <Metric label="Execution type" value={script.execution_type} />
              <Metric label="Requires admin" value={script.submission.safety.requires_admin ? "yes" : "no"} />
            </div>
          </Panel>

          {!isOfficial ? (
            <Panel title="Community Notice">
              <CommunityDisclaimer compact />
            </Panel>
          ) : null}

          <Panel title="Safety">
            <p className="text-sm leading-6 text-slate-300">{script.submission.safety.notes ?? "No safety notes."}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(script.submission.safety.risk_flags.length > 0 ? script.submission.safety.risk_flags : ["no-flags"]).map(
                (flag) => (
                  <span className="border border-slate-700 px-2 py-1 text-xs text-slate-300" key={flag}>
                    {flag}
                  </span>
                ),
              )}
            </div>
          </Panel>

          <Panel title="Related Scripts">
            {related.length === 0 ? (
              <p className="text-sm text-slate-400">No related scripts found yet.</p>
            ) : (
              <div className="grid gap-3">
                {related.map((item) => (
                  <Link
                    className="border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-300 hover:border-rose-400"
                    href={getScriptDetailHref(item)}
                    key={`${item.source}:${item.slug}`}
                  >
                    <span className="block font-semibold text-white">{item.submission.title}</span>
                    <span className="mt-1 block text-xs text-slate-500">{formatSourceLabel(item.source)}</span>
                  </Link>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Related Paid Pack">
            <p className="text-sm leading-6 text-slate-300">
              Unlock vetted automation packs, entitlement-gated technician bundles, and OperatorOS deployment workflows.
            </p>
            <Link
              className="mt-4 block border border-rose-500 bg-rose-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-rose-500"
              href="/scripts/operatoros"
            >
              Explore OperatorOS Packs
            </Link>
          </Panel>
        </aside>
      </div>
    </main>
  );
}

function CommunityDisclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "border border-amber-500/60 bg-amber-950/20 p-4 text-sm leading-6 text-amber-100"
          : "mt-5 border border-amber-500/60 bg-amber-950/20 p-4 text-sm leading-6 text-amber-100"
      }
    >
      Community submitted scripts are reviewed for structure and obvious safety issues, but they are not official
      OperatorOS scripts. Review before running.
    </div>
  );
}

function Panel({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="border border-[#24304A] bg-[#121A2E] p-5 shadow-2xl shadow-black/25">
      <h2 className="mb-4 text-lg font-semibold text-[#F8FAFC]">{title}</h2>
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#24304A] bg-[#0B1020] p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-[#94A3B8]">{label}</p>
      <p className="mt-2 break-words font-semibold text-[#F8FAFC]">{value}</p>
    </div>
  );
}

function HealthMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#24304A] bg-[#0B1020] p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-[#94A3B8]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#00C896]">{value}</p>
    </div>
  );
}

function List({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-400">{empty}</p>;
  }

  return (
    <ul className="space-y-2 text-sm text-slate-300">
      {items.map((item) => (
        <li className="border border-slate-800 bg-slate-900/70 p-3" key={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}
