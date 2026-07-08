import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Spinner } from "./Spinner";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark active:bg-primary-dark focus-visible:ring-primary/50",
  secondary:
    "bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-700 focus-visible:ring-zinc-900/50",
  outline:
    "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 focus-visible:ring-zinc-900/50",
  ghost:
    "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200 focus-visible:ring-zinc-900/50",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      disabled,
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {loading ? <Spinner size="sm" /> : icon}
        {children && <span>{children}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
