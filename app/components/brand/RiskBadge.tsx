import { Badge } from "../ui/primitives";

const riskTone = {
  low: "accent",
  medium: "warning",
  high: "primary",
  critical: "danger",
} as const;

export function RiskBadge({ risk }: { risk: string }) {
  const key = risk.toLowerCase() as keyof typeof riskTone;

  return <Badge tone={riskTone[key] ?? "warning"}>{risk} Risk</Badge>;
}
