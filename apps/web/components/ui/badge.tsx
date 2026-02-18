import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "accent";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-bg-tertiary text-text-secondary",
  success: "bg-emerald-50 text-success",
  warning: "bg-amber-50 text-warning",
  error: "bg-red-50 text-error",
  accent: "bg-accent-subtle text-accent-text",
};

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-2 py-0.5 rounded-full
        text-tiny font-medium
        ${variantStyles[variant]}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
