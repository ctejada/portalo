import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full px-3 py-2
          bg-bg-tertiary text-text-primary
          border rounded-md
          text-body placeholder:text-text-tertiary
          transition-colors duration-150
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

Input.displayName = "Input";
