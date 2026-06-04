export function CommunityBadge({ reviewed = false }: { reviewed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 border border-[#5E81F4] bg-[#5E81F4]/15 px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-100">
      Community
      {reviewed ? <span className="text-[#00C896]">Reviewed</span> : null}
    </span>
  );
}
