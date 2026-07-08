import Link from "next/link";
import { Card } from "@/components/ui/Card";

interface BrandCardProps {
  name: string;
  slug: string;
  imageUrl?: string;
}

export function BrandCard({ name, slug }: BrandCardProps) {
  return (
    <Link href={`/sell/${slug}`}>
      <Card padding="lg" className="text-center hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer">
        <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-zinc-100 flex items-center justify-center text-2xl font-bold text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          {name.charAt(0)}
        </div>
        <p className="text-sm font-medium text-zinc-900">{name}</p>
      </Card>
    </Link>
  );
}
