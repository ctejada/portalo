import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };

  const defaultHeight = variant === "text" ? "1em" : undefined;

  return (
    <div
      className={`
        animate-pulse bg-bg-tertiary
        ${variantStyles[variant]}
        ${className}
      `.trim()}
      style={{
        width: width,
        height: height ?? defaultHeight,
        ...style,
      }}
      {...props}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height="0.875rem"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`p-4 border border-border-primary rounded-md space-y-3 ${className}`}
    >
      <div className="flex items-center gap-3">
        <SkeletonAvatar size={32} />
        <Skeleton variant="text" width="40%" height="1rem" />
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}
