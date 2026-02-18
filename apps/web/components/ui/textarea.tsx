import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`
          w-full px-3 py-2
          bg-bg-tertiary text-text-primary
          border rounded-md
          text-body placeholder:text-text-tertiary
          transition-colors duration-150
          resize-y min-h-[80px]
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-error" : "border-border-primary"}
          ${className}
        `.trim()}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
