import { catalogSrc } from "@/lib/images";

interface CatalogImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

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
