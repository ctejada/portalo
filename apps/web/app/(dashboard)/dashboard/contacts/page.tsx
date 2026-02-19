"use client";

import { useState } from "react";
import useSWR from "swr";
import { usePages } from "@/hooks/use-pages";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { Contact } from "@portalo/shared";

async function fetcher(url: string): Promise<Contact[]> {
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export default function ContactsPage() {
  const { pages, isLoading: pagesLoading } = usePages();
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const pageId = selectedPageId || pages[0]?.id || "";

  const { data: contacts, isLoading } = useSWR(
    pageId ? `/api/v1/contacts?page_id=${pageId}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  async function handleExport() {
    const res = await fetch(`/api/v1/contacts/export?page_id=${pageId}`, {
      method: "POST",
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-page-title">Contacts</h1>
        <div className="flex items-center gap-3">
          {!pagesLoading && pages.length > 1 && (
            <select
              value={pageId}
              onChange={(e) => setSelectedPageId(e.target.value)}
              className="text-small bg-bg-secondary border border-border-primary rounded-md px-2 py-1"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title || p.slug}
                </option>
              ))}
            </select>
          )}
          {contacts && contacts.length > 0 && (
            <Button variant="secondary" size="sm" onClick={handleExport}>
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {!pageId ? (
        <p className="text-body text-text-secondary">
          Create a page to collect contacts.
        </p>
      ) : isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : !contacts || contacts.length === 0 ? (
        <p className="text-body text-text-secondary">
          No contacts yet. Enable email capture on your page to start collecting.
        </p>
      ) : (
        <table className="w-full text-body">
          <thead>
            <tr className="border-b border-border-primary text-text-tertiary text-left">
              <th className="pb-2 font-medium">Email</th>
              <th className="pb-2 font-medium">Source</th>
              <th className="pb-2 font-medium text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className="border-b border-border-secondary">
                <td className="py-2 text-body-strong">{contact.email}</td>
                <td className="py-2 text-text-secondary">{contact.source || "—"}</td>
                <td className="py-2 text-right text-text-secondary">
                  {new Date(contact.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
