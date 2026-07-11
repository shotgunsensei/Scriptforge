import { Badge } from "../ui/primitives";

export function OfficialBadge() {
  return (
    <Badge tone="primary">
      <span aria-hidden="true">OK</span>
      Verified OperatorOS Official
    </Badge>
  );
}
