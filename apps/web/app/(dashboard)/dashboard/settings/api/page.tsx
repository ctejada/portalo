"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";

export default function ApiSettingsPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    if (apiKey && !confirm("This will invalidate your current key. Continue?")) return;

    setGenerating(true);
    try {
      const res = await fetch("/api/v1/account/api-key", { method: "POST" });
      if (!res.ok) {
        showToast("Failed to generate API key", "error");
        return;
      }
      const json = await res.json();
      setApiKey(json.data.api_key);
      showToast("API key generated. Copy it now — it won't be shown again.", "success");
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy() {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    showToast("Copied to clipboard", "success");
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-page-title mb-6">API Keys</h1>

      <div className="space-y-4">
        <p className="text-body text-text-secondary">
          Use your API key to authenticate requests to the Portalo API.
          Include it in the <code className="text-mono bg-bg-secondary px-1 rounded">X-API-Key</code> header.
        </p>

        {apiKey && (
          <div className="flex items-center gap-2">
            <code className="flex-1 text-mono bg-bg-secondary border border-border-primary rounded-md px-3 py-2 truncate">
              {apiKey}
            </code>
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              Copy
            </Button>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={generating}
        >
          {apiKey ? "Regenerate Key" : "Generate API Key"}
        </Button>

        {apiKey && (
          <p className="text-small text-warning">
            Save this key now. It will not be shown again.
          </p>
        )}
      </div>
    </div>
  );
}
