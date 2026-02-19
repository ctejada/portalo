"use client";

import { useState } from "react";
import useSWR from "swr";
import { usePages } from "@/hooks/use-pages";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { Domain } from "@portalo/shared";

async function fetcher(url: string): Promise<Domain[]> {
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

function StatusBadge({ domain }: { domain: Domain }) {
  if (domain.verified) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-tiny font-medium bg-green-100 text-green-800">
        Verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-tiny font-medium bg-amber-100 text-amber-800">
      Pending
    </span>
  );
}

export default function DomainSettingsPage() {
  const { pages, isLoading: pagesLoading } = usePages();
  const { data: domains, isLoading, mutate } = useSWR(
    "/api/v1/domains",
    fetcher,
    { revalidateOnFocus: false }
  );

  const [newDomain, setNewDomain] = useState("");
  const [selectedPageId, setSelectedPageId] = useState("");
  const [adding, setAdding] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);

  const pageId = selectedPageId || pages[0]?.id || "";

  async function handleAdd() {
    if (!newDomain.trim() || !pageId) return;
    setAdding(true);
    try {
      const res = await fetch("/api/v1/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newDomain.trim(), page_id: pageId }),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast(json.error?.message || "Failed to add domain", "error");
        return;
      }
      setNewDomain("");
      await mutate();
      showToast("Domain added. Set up your CNAME record, then verify.", "success");
    } finally {
      setAdding(false);
    }
  }

  async function handleVerify(domainId: string) {
    setVerifying(domainId);
    try {
      const res = await fetch(`/api/v1/domains/${domainId}/verify`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.data?.verified) {
        showToast("Domain verified!", "success");
      } else {
        showToast("DNS not yet pointing to Portalo. Check your CNAME record.", "info");
      }
      await mutate();
    } finally {
      setVerifying(null);
    }
  }

  async function handleDelete(domainId: string) {
    if (!confirm("Remove this domain?")) return;
    await fetch(`/api/v1/domains/${domainId}`, { method: "DELETE" });
    await mutate();
    showToast("Domain removed", "success");
  }

  if (isLoading || pagesLoading) {
    return (
      <div className="p-6 max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-page-title mb-6">Custom Domains</h1>

      <div className="space-y-4">
        <p className="text-body text-text-secondary">
          Point a custom domain to your Portalo page. Add a CNAME record
          pointing to{" "}
          <code className="text-mono bg-bg-secondary px-1 rounded">
            cname.portalo.so
          </code>
          .
        </p>

        <div className="flex gap-2">
          {pages.length > 1 && (
            <select
              value={pageId}
              onChange={(e) => setSelectedPageId(e.target.value)}
              className="text-small bg-bg-secondary border border-border-primary rounded-md px-2 py-2"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title || p.slug}
                </option>
              ))}
            </select>
          )}
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="example.com"
            className="flex-1 text-body bg-bg-primary border border-border-primary rounded-md px-3 py-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Button onClick={handleAdd} disabled={adding || !newDomain.trim()}>
            {adding ? "Adding…" : "Add"}
          </Button>
        </div>

        {domains && domains.length > 0 && (
          <div className="space-y-2">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="flex items-center justify-between border border-border-primary rounded-md px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-body-strong">{domain.domain}</span>
                  <StatusBadge domain={domain} />
                </div>
                <div className="flex items-center gap-2">
                  {!domain.verified && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleVerify(domain.id)}
                      disabled={verifying === domain.id}
                    >
                      {verifying === domain.id ? "Checking…" : "Verify"}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(domain.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
