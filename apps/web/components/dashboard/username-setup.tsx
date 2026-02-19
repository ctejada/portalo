"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Input, Dialog, DialogTitle, showToast } from "@/components/ui";

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "portalo.so";

interface UsernameSetupProps {
  displayName?: string | null;
  onComplete: () => void;
  onDismiss: () => void;
}

export function UsernameSetup({ displayName, onComplete, onDismiss }: UsernameSetupProps) {
  const [open, setOpen] = useState(true);
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const checkTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // Pre-populate from display name
  useEffect(() => {
    if (displayName) {
      const formatted = displayName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 32);
      if (formatted) {
        setUsername(formatted);
        setTitle(displayName);
      }
    }
  }, [displayName]);

  // Debounced availability check
  const checkAvailability = useCallback((value: string) => {
    if (checkTimer.current) clearTimeout(checkTimer.current);
    if (!value || value.length < 1) {
      setAvailable(null);
      setChecking(false);
      return;
    }
    setChecking(true);
    setAvailable(null);
    checkTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/public/username-check?username=${encodeURIComponent(value)}`);
        const json = await res.json();
        setAvailable(json.available ?? false);
        if (!json.available && json.reason === "reserved") {
          setError("This username is reserved");
        } else if (!json.available) {
          setError("Already taken");
        } else {
          setError("");
        }
      } catch {
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 400);
  }, []);

  useEffect(() => {
    return () => {
      if (checkTimer.current) clearTimeout(checkTimer.current);
    };
  }, []);

  function handleUsernameChange(value: string) {
    const formatted = value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 32);
    setUsername(formatted);
    setError("");
    checkAvailability(formatted);
  }

  function handleClose() {
    setOpen(false);
    onDismiss();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || available === false || checking) return;

    setSubmitting(true);
    setError("");

    const res = await fetch("/api/v1/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        display_name: title || undefined,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setSubmitting(false);
      if (json.error?.code === "username_taken") {
        setError("This username is already taken");
        setAvailable(false);
      } else if (json.error?.code === "username_reserved") {
        setError("This username is reserved");
        setAvailable(false);
      } else {
        setError(json.error?.message || "Something went wrong");
      }
      return;
    }

    showToast("Your page is ready!", "success");
    setSubmitting(false);
    setOpen(false);
    onComplete();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Welcome to Portalo</DialogTitle>
      <p className="text-body text-text-secondary mb-5">
        Choose your username to create your public link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="text-small text-text-secondary mb-1.5 block">
            Username
          </label>
          <Input
            id="username"
            placeholder="your-name"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            autoFocus
          />

          {/* Live preview */}
          <p className="text-small text-text-tertiary mt-1.5">
            {APP_DOMAIN}/@{username || "your-name"}
          </p>

          {/* Availability status */}
          {username && (
            <div className="mt-1" aria-live="polite">
              {checking && (
                <p className="text-tiny text-text-tertiary">Checking...</p>
              )}
              {!checking && available === true && (
                <p className="text-tiny text-success">Available</p>
              )}
              {!checking && available === false && error && (
                <p className="text-tiny text-error">{error}</p>
              )}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="title" className="text-small text-text-secondary mb-1.5 block">
            Display name (optional)
          </label>
          <Input
            id="title"
            placeholder="Your Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" size="md" onClick={handleClose}>
            Skip for now
          </Button>
          <Button
            type="submit"
            size="md"
            disabled={submitting || !username || checking || available === false}
          >
            {submitting ? "Creating your page..." : "Claim username"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
