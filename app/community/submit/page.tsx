import type { Metadata } from "next";
import { CommunitySubmitForm } from "./submit-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Submit a PowerShell Script | OperatorOS ScriptForge",
  description:
    "Download ScriptForge JSON and YAML templates or submit a community PowerShell script for pending OperatorOS review.",
  alternates: {
    canonical: "/community/submit",
  },
};

export default function CommunitySubmitPage() {
  const uploadsEnabled = (process.env.ENABLE_COMMUNITY_UPLOADS ?? "true").toLowerCase() === "true";
  const maxKb = Number.parseInt(process.env.COMMUNITY_UPLOAD_MAX_KB ?? "250", 10) || 250;
  const captchaEnabled = (process.env.ENABLE_CAPTCHA ?? "false").toLowerCase() === "true";
  const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY ?? "";

  return (
    <main className="min-h-screen px-5 py-6 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="border-b border-slate-800 pb-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-300">
                ScriptForge Community
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white md:text-4xl">
                Submit a PowerShell Script
              </h1>
            </div>
            <div className="rounded border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
              Public submissions always enter <span className="font-semibold text-white">pending review</span>.
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="text-sm leading-6 text-slate-300">
            Uploads are capped at <span className="font-semibold text-white">{maxKb} KB</span>. Allowed extensions:
            <span className="font-mono text-slate-100"> .ps1, .psm1, .json, .yaml, .yml</span>.
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              className="border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:border-rose-400"
              download
              href="/api/community/scripts/submit?template=json"
            >
              Download JSON Template
            </a>
            <a
              className="border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:border-rose-400"
              download
              href="/api/community/scripts/submit?template=yaml"
            >
              Download YAML Template
            </a>
          </div>
        </section>

        {!uploadsEnabled ? (
          <section className="border border-amber-900 bg-amber-950/40 p-5">
            <h2 className="text-lg font-semibold text-white">Community uploads are disabled</h2>
            <p className="mt-2 text-sm leading-6 text-amber-100">
              Set <code>ENABLE_COMMUNITY_UPLOADS=true</code> to enable this public workflow.
            </p>
          </section>
        ) : (
          <CommunitySubmitForm
            captchaEnabled={captchaEnabled}
            maxKb={maxKb}
            turnstileSiteKey={turnstileSiteKey}
          />
        )}
      </div>
    </main>
  );
}
