"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/ui/toast";

interface AvatarUploadProps {
  userId: string;
  currentUrl: string | null;
  onUploaded: (url: string) => void;
}

export function AvatarUpload({ userId, currentUrl, onUploaded }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be under 2MB", "error");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        showToast("Upload failed", "error");
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;

      // Save to profile
      const res = await fetch("/api/v1/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: url }),
      });

      if (!res.ok) {
        showToast("Failed to update avatar", "error");
        return;
      }

      onUploaded(url);
      showToast("Avatar updated", "success");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative w-16 h-16 rounded-full bg-bg-secondary border border-border-primary overflow-hidden hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {currentUrl ? (
          <img
            src={currentUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-text-tertiary text-xl">
            ?
          </span>
        )}
      </button>
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-small text-accent hover:underline disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Change avatar"}
        </button>
        <p className="text-tiny text-text-tertiary">JPG, PNG. Max 2MB.</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
