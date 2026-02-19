"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Dialog({ open, onClose, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (open) {
      el.showModal();
    } else {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        // Close when clicking backdrop
        if (e.target === dialogRef.current) onClose();
      }}
      className="backdrop:bg-black/40 bg-transparent p-0 m-auto max-w-lg w-full"
    >
      <div className="bg-bg-primary border border-border-primary rounded-xl p-6 shadow-lg">
        {children}
      </div>
    </dialog>
  );
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-section-title mb-4">{children}</h2>;
}
