import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";

interface DeviceCardProps {
  name: string;
  slug: string;
  imageUrl: string;
  brandSlug: string;
  maxQuoteCents: number;
}

export function DeviceCard({ name, slug, brandSlug, maxQuoteCents }: DeviceCardProps) {
  return (
    <Link href={`/sell/${brandSlug}/${slug}`}>
      <Card padding="md" className="text-center hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer">
        <div className="w-full aspect-square mb-3 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-50 flex items-center justify-center">
          <svg className="w-16 h-16 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
          </svg>
        </div>
        <p className="text-sm font-medium text-zinc-900 truncate">{name}</p>
        <p className="text-xs text-zinc-500 mt-1">
          Cash in up to{" "}
          <span className="font-semibold text-emerald-600">
            {formatPrice(maxQuoteCents)}
          </span>
        </p>
      </Card>
    </Link>
  );
}
