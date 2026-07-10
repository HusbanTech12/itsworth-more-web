import Link from "next/link";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-zinc-600 transition-colors capitalize"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-zinc-900 font-medium" : "text-zinc-400"}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
