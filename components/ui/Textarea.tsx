import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-zinc-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`flex min-h-[80px] w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${
            error
              ? "border-red-500 focus:ring-red-500/50"
              : "border-zinc-300 focus:border-primary focus:ring-primary/50"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
