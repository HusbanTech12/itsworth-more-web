import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-zinc-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${
            error
              ? "border-red-500 focus:ring-red-500/50"
              : "border-zinc-300 focus:border-primary focus:ring-primary/50"
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
