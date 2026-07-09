import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  padding = "md",
  className = "",
  style,
}: CardProps) {
  return (
    <div
      className={`rounded-lg border border-zinc-200 bg-white shadow-sm ${paddingStyles[padding]} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
