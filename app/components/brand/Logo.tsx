import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="flex items-center gap-3 text-white" href="/">
      <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#E53935] bg-[#121A2E]">
        <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 64 64">
          <path d="M32 8 12 38h40L32 8Z" fill="none" stroke="#F8FAFC" strokeWidth="5" strokeLinejoin="miter" />
          <path d="M21 38h22M32 38v10M24 56l8-8 8 8" fill="none" stroke="#F8FAFC" strokeWidth="5" strokeLinecap="square" />
        </svg>
      </span>
      {!compact ? (
        <span className="leading-tight">
          <span className="block text-sm font-semibold uppercase tracking-[0.22em] text-[#94A3B8]">OperatorOS</span>
          <span className="block text-xl font-semibold tracking-normal">ScriptForge</span>
        </span>
      ) : null}
    </Link>
  );
}
