"use client";

export function ScriptDetailActions({
  slug,
  title,
  scriptBody,
  bodyAvailable = false,
  githubFileUrl,
  categoryHref,
  categoryLabel = "Category",
  libraryHref = "/scripts",
}: {
  slug: string;
  title?: string;
  scriptBody: string;
  bodyAvailable?: boolean;
  githubFileUrl?: string | null;
  categoryHref?: string;
  categoryLabel?: string;
  libraryHref?: string;
}) {
  function copyScript() {
    if (!bodyAvailable) return;
    void navigator.clipboard.writeText(scriptBody);
  }

  function downloadScript() {
    if (!bodyAvailable) return;
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
      {!bodyAvailable ? <p className="mb-3 text-sm leading-6 text-amber-200">Protected source · access verification unavailable</p> : null}
      <div className="hidden flex-wrap gap-3 md:flex">
        <ActionLink href={libraryHref} label="← Library" />
        {categoryHref ? <ActionLink href={categoryHref} label={categoryLabel} /> : null}
        <ActionButton label="Copy Script" onClick={copyScript} disabled={!bodyAvailable} primary />
        <ActionButton label="Download .ps1" onClick={downloadScript} disabled={!bodyAvailable} />
        {bodyAvailable && githubFileUrl ? <ActionLink href={githubFileUrl} label="GitHub" /> : <span className="px-4 py-2 text-sm text-slate-400">Source link not provided</span>}
        <ActionLink href={buildReportHref("Report broken script", title ?? slug)} label="Report Issue" />
      </div>
      <details className="md:hidden">
        <summary className="cursor-pointer list-none border border-[#E53935] bg-[#E53935] px-4 py-2 text-sm font-semibold text-white">
          Script Actions
        </summary>
        <div className="mt-3 grid gap-2">
          <ActionLink href={libraryHref} label="← Library" />
          {categoryHref ? <ActionLink href={categoryHref} label={categoryLabel} /> : null}
          <ActionButton label="Copy Script" onClick={copyScript} disabled={!bodyAvailable} primary />
          <ActionButton label="Download .ps1" onClick={downloadScript} disabled={!bodyAvailable} />
          {bodyAvailable && githubFileUrl ? <ActionLink href={githubFileUrl} label="GitHub" /> : <span className="px-4 py-2 text-sm text-slate-400">Source link not provided</span>}
          <ActionLink href={buildReportHref("Report broken script", title ?? slug)} label="Report Issue" />
        </div>
      </details>
    </>
  );
}

function ActionButton({ label, onClick, primary = false, disabled = false }: { label: string; onClick: () => void; primary?: boolean; disabled?: boolean }) {
  return (
    <button
      className={
        primary
          ? "border border-[#E53935] bg-[#E53935] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c92f2b]"
          : "border border-[#24304A] bg-[#0B1020] px-4 py-2 text-sm font-semibold text-white hover:border-[#5E81F4]"
      }
      onClick={onClick}
      disabled={disabled}
      style={disabled ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
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
