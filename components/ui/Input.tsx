import { type InputHTMLAttributes, forwardRef, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-zinc-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${
              error
                ? "border-red-500 focus:ring-red-500/50"
                : "border-zinc-300 focus:border-primary focus:ring-primary/50"
            } ${icon ? "pl-10" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-zinc-500">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
