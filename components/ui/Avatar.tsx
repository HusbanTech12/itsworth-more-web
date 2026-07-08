interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  className = "",
}: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover ${sizeStyles[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold ${sizeStyles[size]} ${className}`}
    >
      {initials ? initials.slice(0, 2).toUpperCase() : "?"}
    </div>
  );
}
