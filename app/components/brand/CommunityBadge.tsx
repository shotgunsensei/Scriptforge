import { Badge } from "../ui/primitives";

export function CommunityBadge({ reviewed = false }: { reviewed?: boolean }) {
  return (
    <Badge tone="secondary">
      Community
      {reviewed ? <span className="text-accent">Reviewed</span> : null}
    </Badge>
  );
}
