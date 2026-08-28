import { catalogSrc } from "@/lib/images";

interface CatalogImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

const centeredSizeClasses = {
  sm: "max-h-[78%] max-w-[85%]",
  md: "max-h-[85%] max-w-[85%]",
  lg: "max-h-[90%] max-w-[90%]",
} as const;

export function CatalogImage({ src, alt, className = "", priority = false }: CatalogImageProps) {
  const href = catalogSrc(src);
  if (!href) return null;

  return (
    <img
      src={href}
      alt={alt}
      width={640}
      height={640}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}

interface CatalogImageFrameProps {
  src: string;
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
  priority?: boolean;
  size?: keyof typeof centeredSizeClasses;
}

/** Centers catalog images inside a flex container (matches sell grid cards). */
export function CatalogImageFrame({
  src,
  alt,
  containerClassName = "",
  imageClassName = "",
  priority = false,
  size = "md",
}: CatalogImageFrameProps) {
  const href = catalogSrc(src);
  if (!href) return null;

  return (
    <div
      className={`flex items-center justify-center overflow-hidden p-6 sm:p-8 ${containerClassName}`}
    >
      <img
        src={href}
        alt={alt}
        width={640}
        height={640}
        className={`block h-auto w-auto object-contain object-center ${centeredSizeClasses[size]} ${imageClassName}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </div>
  );
}
