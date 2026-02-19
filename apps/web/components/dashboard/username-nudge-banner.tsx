"use client";

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "portalo.so";

interface UsernameNudgeBannerProps {
  onSetup: () => void;
}

export function UsernameNudgeBanner({ onSetup }: UsernameNudgeBannerProps) {
  return (
    <div
      role="status"
      className="mx-6 mt-6 flex items-center justify-between gap-4 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3"
    >
      <p className="text-body text-text-secondary">
        Claim your public link &mdash;{" "}
        <span className="text-body-strong text-text-primary">{APP_DOMAIN}/@you</span>
      </p>
      <button
        onClick={onSetup}
        className="shrink-0 text-small font-medium text-accent hover:underline"
      >
        Set username &rarr;
      </button>
    </div>
  );
}
