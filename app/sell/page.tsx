"use client";

import { Card } from "@/components/ui/Card";
import { SearchInput } from "@/components/ui/SearchInput";
import { categories } from "@/lib/data";

export default function SellPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            Selling made simple
          </h1>
          <p className="mt-2 text-zinc-500">
            Find the device you&apos;d like to swap for cash.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-10">
          <SearchInput
            placeholder="Search devices..."
            onSearch={(q) => console.log(q)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { label: "Sell iPhone", href: "/sell/iphone" },
            { label: "Sell Samsung", href: "/sell/samsung" },
            { label: "Sell iPad", href: "/sell/ipad" },
            { label: "Sell MacBook", href: "/sell/macbook" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 rounded-full bg-white border border-zinc-200 text-sm font-medium text-zinc-700 hover:border-primary hover:text-primary transition-colors shadow-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <a key={cat.slug} href={`/sell/${cat.slug}`}>
              <Card padding="lg" className="text-center hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer h-full">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <p className="text-sm font-medium text-zinc-900">
                  Sell {cat.name.replace("Mobile ", "").replace("s$", "")}
                </p>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
