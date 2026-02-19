"use client";

import { useState } from "react";

interface EmailCaptureProps {
  pageId: string;
  themeName?: string;
}

export function EmailCapture({ pageId, themeName }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const isDark = themeName === "minimal-dark";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/v1/public/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_id: pageId, email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className={`text-xs text-center ${isDark ? "text-[#9CA3AF]" : "text-text-secondary"}`}>
        Thanks! You&apos;re subscribed.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className={`flex-1 px-3 py-1.5 text-sm rounded-md border ${
          isDark
            ? "bg-[#1A1A1A] border-[#2A2A2A] text-[#F9FAFB] placeholder:text-[#6B7280]"
            : "bg-white border-border-primary text-text-primary placeholder:text-text-tertiary"
        } focus:outline-none focus:border-accent`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-3 py-1.5 text-sm bg-accent text-text-inverse rounded-md hover:bg-accent-hover disabled:opacity-50"
      >
        {status === "loading" ? "..." : "\u2192"}
      </button>
    </form>
  );
}
