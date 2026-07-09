"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ConditionSelector } from "@/components/sell/ConditionSelector";
import { QuoteDisplay } from "@/components/sell/QuoteDisplay";
import { AddToBoxButton } from "@/components/sell/AddToBoxButton";

interface PriceData {
  id: number;
  conditionSlug: string;
  priceCents: number;
  conditionLabel: string;
  conditionDescription: string;
}

interface DeviceData {
  id: number;
  name: string;
  slug: string;
  brandId: number;
  imageUrl: string | null;
  maxQuoteCents: number | null;
}

export default function DevicePage() {
  const params = useParams();
  const category = params.category as string;
  const brand = params.brand as string;
  const device = params.device as string;

  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/brands/${brand}/devices`);
        const data = await res.json();
        const found = data.devices?.find((d: DeviceData) => d.slug === device);
        if (found) {
          setDeviceData(found);
          const priceRes = await fetch(`/api/devices/${found.id}/price`);
          const priceData = await priceRes.json();
          setPrices(priceData.prices || []);
        }
      } catch (e) {
        console.error("Failed to load device:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [brand, device]);

  const [selectedCondition, setSelectedCondition] = useState("");
  useEffect(() => {
    if (prices.length > 0 && !selectedCondition) {
      setSelectedCondition(prices[0].conditionSlug);
    }
  }, [prices, selectedCondition]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!deviceData) notFound();

  const conditions = prices.map((p) => ({
    slug: p.conditionSlug,
    label: p.conditionLabel,
    description: p.conditionDescription,
    priceCents: p.priceCents,
  }));

  const currentCondition = conditions.find((c) => c.slug === selectedCondition);
  const currentPrice = currentCondition?.priceCents ?? 0;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6 flex-wrap">
          <Link href="/sell" className="hover:text-zinc-600 transition-colors">Sell</Link>
          <span>/</span>
          <Link href={`/sell/${category}`} className="hover:text-zinc-600 transition-colors capitalize">
            {category}
          </Link>
          <span>/</span>
          <Link href={`/sell/${category}/${brand}`} className="hover:text-zinc-600 transition-colors capitalize">
            {brand}
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium">{deviceData.name}</span>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3">
            <Card padding="lg">
              <div className="w-full aspect-square max-w-md mx-auto rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 flex items-center justify-center mb-6">
                <svg className="w-32 h-32 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">
                {deviceData.name}
              </h1>
              <p className="text-sm text-zinc-500 mb-6">
                Cash in up to{" "}
                <strong>${((deviceData.maxQuoteCents ?? 0) / 100).toLocaleString()}</strong>
              </p>

              <div className="border-t border-zinc-200 pt-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                  Select Condition
                </h2>
                <ConditionSelector
                  conditions={conditions}
                  selected={selectedCondition}
                  onSelect={setSelectedCondition}
                />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <QuoteDisplay
                priceCents={currentPrice}
                deviceName={deviceData.name}
                conditionLabel={currentCondition?.label}
              />

              <AddToBoxButton
                conditionSlug={selectedCondition}
              />

              <Card padding="md" className="text-sm text-zinc-500 space-y-2">
                <p className="font-medium text-zinc-900">Why sell to us?</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Free shipping with prepaid label
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Fast payment within 24-48 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Safe & secure data wiping
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    21-day locked-in quote
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
