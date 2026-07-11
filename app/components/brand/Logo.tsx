import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="group flex items-center gap-3 text-white" href="/">
      <span className="grid h-11 w-11 place-items-center border border-primary/80 bg-panel shadow-glow-red transition group-hover:border-primary">
        <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 64 64">
          <path d="M32 8 12 38h40L32 8Z" fill="none" stroke="rgb(var(--sf-ink))" strokeWidth="5" strokeLinejoin="miter" />
          <path d="M21 38h22M32 38v10M24 56l8-8 8 8" fill="none" stroke="rgb(var(--sf-ink))" strokeWidth="5" strokeLinecap="square" />
        </svg>
      </span>
      {!compact ? (
        <span className="leading-tight">
          <span className="block text-xs font-semibold uppercase tracking-[0.26em] text-muted">OperatorOS</span>
          <span className="block text-xl font-semibold tracking-normal text-ink">ScriptForge</span>
        </span>
      ) : null}
    </Link>
  );
}
