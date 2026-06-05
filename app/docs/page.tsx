import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation | OperatorOS ScriptForge",
  description: "OperatorOS ScriptForge documentation, workflow references, API notes, and legal links.",
};

export default function DocumentationPage() {
  return (
    <main className="min-h-screen px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="border-b border-[#24304A] pb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5E81F4]">OperatorOS ScriptForge</p>
          <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Documentation</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#94A3B8]">
            Workflow references and recovery links for technicians, reviewers, and production operators.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <DocCard href="/scripts" title="Script Library" text="Browse official and reviewed community scripts." />
          <DocCard href="/community/submit" title="Community Submission" text="Submit PowerShell scripts for review." />
          <DocCard href="/admin/scripts/review" title="Review Workflow" text="Review, approve, reject, or promote pending scripts." />
          <DocCard href="/admin/system" title="System Dashboard" text="Check storage, index, and health status." />
        </section>

        <section className="border border-[#24304A] bg-[#121A2E] p-5" id="api-docs">
          <h2 className="text-xl font-semibold text-white">API Docs</h2>
          <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
            Public template downloads are available from <code>/api/community/scripts/submit?template=json</code> and{" "}
            <code>/api/community/scripts/submit?template=yaml</code>. Health status is available from <code>/api/health</code>.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <LegalSection id="privacy" title="Privacy Policy" />
          <LegalSection id="terms" title="Terms" />
          <LegalSection id="copyright" title="Copyright" />
        </section>
      </div>
    </main>
  );
}

function DocCard({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link className="border border-[#24304A] bg-[#121A2E] p-5 hover:border-[#E53935]" href={href}>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#94A3B8]">{text}</p>
    </Link>
  );
}

function LegalSection({ id, title }: { id: string; title: string }) {
  return (
    <section className="border border-[#24304A] bg-[#121A2E] p-5" id={id}>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
        Formal {title.toLowerCase()} content should be reviewed before public launch.
      </p>
    </section>
  );
}
