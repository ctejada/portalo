"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          fontFamily: "var(--font-sans)",
          fontSize: "0.875rem",
          borderRadius: "0.375rem",
        },
      }}
    />
  );
}
