const riskClasses = {
  low: "border-[#00C896] bg-[#00C896]/10 text-[#A7F3D0]",
  medium: "border-yellow-400 bg-yellow-400/10 text-yellow-100",
  high: "border-orange-500 bg-orange-500/10 text-orange-100",
  critical: "border-[#E53935] bg-[#E53935]/15 text-red-100",
};

export function RiskBadge({ risk }: { risk: string }) {
  const key = risk.toLowerCase() as keyof typeof riskClasses;
  const className = riskClasses[key] ?? riskClasses.medium;

  return <span className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${className}`}>{risk} Risk</span>;
}
