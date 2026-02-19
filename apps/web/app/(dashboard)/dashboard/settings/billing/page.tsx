"use client";

import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import { PLANS } from "@portalo/shared";
import type { Plan } from "@portalo/shared";

export default function BillingPage() {
  const { user, isLoading } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  const currentPlan = (user?.plan ?? "free") as Plan;

  async function handleUpgrade(plan: string) {
    setLoading(plan);
    try {
      const res = await fetch("/api/v1/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const json = await res.json();
      if (json.data?.url) {
        window.location.href = json.data.url;
      } else {
        showToast("Failed to start checkout", "error");
      }
    } finally {
      setLoading(null);
    }
  }

  async function handleManage() {
    setLoading("manage");
    try {
      const res = await fetch("/api/v1/billing/portal", { method: "POST" });
      const json = await res.json();
      if (json.data?.url) {
        window.location.href = json.data.url;
      } else {
        showToast("Failed to open billing portal", "error");
      }
    } finally {
      setLoading(null);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-page-title">Billing</h1>
        <PlanBadge plan={currentPlan} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {(Object.entries(PLANS) as [Plan, typeof PLANS.free][]).map(
          ([plan, config]) => {
            const isCurrent = plan === currentPlan;
            const isUpgrade =
              Object.keys(PLANS).indexOf(plan) >
              Object.keys(PLANS).indexOf(currentPlan);

            return (
              <div
                key={plan}
                className={`border rounded-lg p-4 ${
                  isCurrent
                    ? "border-accent bg-bg-active"
                    : "border-border-primary"
                }`}
              >
                <h3 className="text-body-strong mb-1">{config.name}</h3>
                <p className="text-page-title mb-3">
                  {config.price === 0
                    ? "Free"
                    : `$${config.price / 100}/mo`}
                </p>
                <ul className="text-small text-text-secondary space-y-1 mb-4">
                  <li>{config.limits.pages} page{config.limits.pages > 1 ? "s" : ""}</li>
                  <li>{config.limits.links_per_page} links per page</li>
                  <li>{config.limits.analytics_days}d analytics</li>
                  {config.limits.email_capture && <li>Email capture</li>}
                  {config.limits.custom_domains > 0 && (
                    <li>{config.limits.custom_domains} custom domain{config.limits.custom_domains > 1 ? "s" : ""}</li>
                  )}
                  {config.limits.remove_branding && <li>Remove branding</li>}
                </ul>
                {isCurrent ? (
                  <Button variant="secondary" size="sm" disabled className="w-full">
                    Current Plan
                  </Button>
                ) : isUpgrade ? (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleUpgrade(plan)}
                    disabled={loading !== null}
                  >
                    {loading === plan ? "Redirecting…" : "Upgrade"}
                  </Button>
                ) : null}
              </div>
            );
          }
        )}
      </div>

      {currentPlan !== "free" && (
        <Button
          variant="secondary"
          onClick={handleManage}
          disabled={loading === "manage"}
        >
          {loading === "manage" ? "Opening…" : "Manage Billing"}
        </Button>
      )}
    </div>
  );
}
