import { PLANS } from "@portalo/shared";
import type { Plan } from "@portalo/shared";

const badgeStyles: Record<Plan, string> = {
  free: "bg-bg-secondary text-text-secondary",
  pro: "bg-accent/10 text-accent-text",
  business: "bg-amber-100 text-amber-800",
};

export function PlanBadge({ plan }: { plan: Plan }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-tiny font-medium ${badgeStyles[plan]}`}
    >
      {PLANS[plan].name}
    </span>
  );
}
