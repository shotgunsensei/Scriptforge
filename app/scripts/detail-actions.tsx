"use client";

export function ScriptDetailActions({ slug, scriptBody }: { slug: string; scriptBody: string }) {
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
      <a
        className="border border-[#24304A] bg-[#0B1020] px-4 py-2 text-sm font-semibold text-[#94A3B8]"
        href="#github-link-placeholder"
      >
        GitHub Link
      </a>
    </div>
  );
}
