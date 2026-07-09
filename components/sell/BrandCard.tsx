import Link from "next/link";
import { Card } from "@/components/ui/Card";

interface BrandCardProps {
  name: string;
  slug: string;
  imageUrl?: string;
}

export function BrandCard({ name, slug, imageUrl }: BrandCardProps) {
  return (
    <Link href={`/sell/${slug}`}>
      <Card padding="lg" className="text-center hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden mb-3 bg-zinc-100">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {name.charAt(0)}
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-zinc-900 group-hover:text-primary transition-colors">{name}</p>
        </div>
      </Card>
    </Link>
  );
}
