"use client";

export function ScriptDetailActions({
  slug,
  title,
  scriptBody,
  githubFileUrl,
}: {
  slug: string;
  title?: string;
  scriptBody: string;
  githubFileUrl?: string | null;
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
    <div className="flex flex-wrap gap-3">
      <button
        className="border border-[#E53935] bg-[#E53935] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c92f2b]"
        onClick={copyScript}
        type="button"
      >
        Copy Script
      </button>
      <button
        className="border border-[#24304A] bg-[#0B1020] px-4 py-2 text-sm font-semibold text-white hover:border-[#5E81F4]"
        onClick={downloadScript}
        type="button"
      >
        Download .ps1
      </button>
      <ActionLink href={githubFileUrl ?? "#github-link-placeholder"} label="GitHub Source" />
      <ActionLink href={buildReportHref("Report broken script", title ?? slug)} label="Report Broken" />
      <ActionLink href={buildReportHref("Report unsafe script", title ?? slug)} label="Report Unsafe" />
      <ActionLink href={buildReportHref("Request script improvement", title ?? slug)} label="Request Improvement" />
    </div>
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
