"use client";

export function ScriptDetailActions({
  slug,
  title,
  scriptBody,
  githubFileUrl,
  categoryHref,
  categoryLabel = "Category",
  libraryHref = "/scripts",
}: {
  slug: string;
  title?: string;
  scriptBody: string;
  githubFileUrl?: string | null;
  categoryHref?: string;
  categoryLabel?: string;
  libraryHref?: string;
}) {
  function copyScript() {
    void navigator.clipboard.writeText(scriptBody);
  }

  function downloadScript() {
    const blob = new Blob([scriptBody], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slug}.ps1`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="hidden flex-wrap gap-3 md:flex">
        <ActionLink href={libraryHref} label="← Library" />
        {categoryHref ? <ActionLink href={categoryHref} label={categoryLabel} /> : null}
        <ActionButton label="Copy Script" onClick={copyScript} primary />
        <ActionButton label="Download .ps1" onClick={downloadScript} />
        <ActionLink href={githubFileUrl ?? "#github-link-placeholder"} label="GitHub" />
        <ActionLink href={buildReportHref("Report broken script", title ?? slug)} label="Report Issue" />
      </div>
      <details className="md:hidden">
        <summary className="cursor-pointer list-none border border-[#E53935] bg-[#E53935] px-4 py-2 text-sm font-semibold text-white">
          Script Actions
        </summary>
        <div className="mt-3 grid gap-2">
          <ActionLink href={libraryHref} label="← Library" />
          {categoryHref ? <ActionLink href={categoryHref} label={categoryLabel} /> : null}
          <ActionButton label="Copy Script" onClick={copyScript} primary />
          <ActionButton label="Download .ps1" onClick={downloadScript} />
          <ActionLink href={githubFileUrl ?? "#github-link-placeholder"} label="GitHub" />
          <ActionLink href={buildReportHref("Report broken script", title ?? slug)} label="Report Issue" />
        </div>
      </details>
    </>
  );
}

function ActionButton({ label, onClick, primary = false }: { label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button
      className={
        primary
          ? "border border-[#E53935] bg-[#E53935] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c92f2b]"
          : "border border-[#24304A] bg-[#0B1020] px-4 py-2 text-sm font-semibold text-white hover:border-[#5E81F4]"
      }
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="border border-[#24304A] bg-[#0B1020] px-4 py-2 text-sm font-semibold text-[#94A3B8] hover:border-[#5E81F4] hover:text-white"
      href={href}
    >
      {label}
    </a>
  );
}

function buildReportHref(action: string, scriptTitle: string): string {
  const subject = encodeURIComponent(`[ScriptForge] ${action}: ${scriptTitle}`);
  const body = encodeURIComponent(
    `Script: ${scriptTitle}\nRequest type: ${action}\n\nDescribe the issue, unsafe behavior, or requested improvement:\n`,
  );

  return `mailto:scripts@operatoros.net?subject=${subject}&body=${body}`;
}
