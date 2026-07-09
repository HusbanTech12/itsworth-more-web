"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ConditionSelector } from "@/components/sell/ConditionSelector";
import { QuoteDisplay } from "@/components/sell/QuoteDisplay";
import { AddToBoxButton } from "@/components/sell/AddToBoxButton";
import { DeviceDetailsForm, type DeviceDetails } from "@/components/sell/DeviceDetailsForm";

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

const deviceImages: Record<string, string> = {
  "iphone-17-pro-max": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=3840&q=85&fit=crop&auto=format",
  "iphone-17-pro": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=3840&q=85&fit=crop&auto=format",
  "iphone-17": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=3840&q=85&fit=crop&auto=format",
  "iphone-17e": "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=3840&q=85&fit=crop&auto=format",
  "iphone-16-pro-max": "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=3840&q=85&fit=crop&auto=format",
  "iphone-16-pro": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=3840&q=85&fit=crop&auto=format",
  "iphone-16": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=3840&q=85&fit=crop&auto=format",
  "iphone-16-plus": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=3840&q=85&fit=crop&auto=format",
  "iphone-15-pro-max": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=3840&q=85&fit=crop&auto=format",
  "iphone-15-pro": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=3840&q=85&fit=crop&auto=format",
  "iphone-15": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=3840&q=85&fit=crop&auto=format",
  "iphone-14-pro-max": "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=3840&q=85&fit=crop&auto=format",
  "iphone-14": "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=3840&q=85&fit=crop&auto=format",
  "iphone-13": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=3840&q=85&fit=crop&auto=format",
  "iphone-13-mini": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=3840&q=85&fit=crop&auto=format",
  "iphone-12": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=3840&q=85&fit=crop&auto=format",
  "iphone-se-3rd-gen": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=3840&q=85&fit=crop&auto=format",
  "galaxy-s25-ultra": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=3840&q=85&fit=crop&auto=format",
  "galaxy-s25-plus": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=3840&q=85&fit=crop&auto=format",
  "galaxy-s25": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=3840&q=85&fit=crop&auto=format",
  "galaxy-s24-ultra": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=3840&q=85&fit=crop&auto=format",
  "galaxy-z-fold-6": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=3840&q=85&fit=crop&auto=format",
  "galaxy-z-flip-6": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=3840&q=85&fit=crop&auto=format",
  "pixel-9-pro": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=3840&q=85&fit=crop&auto=format",
  "pixel-9": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=3840&q=85&fit=crop&auto=format",
  "ipad-pro-m4": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=3840&q=85&fit=crop&auto=format",
  "ipad-air-m2": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=3840&q=85&fit=crop&auto=format",
  "macbook-pro-16-m4": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=3840&q=85&fit=crop&auto=format",
  "macbook-air-15-m4": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=3840&q=85&fit=crop&auto=format",
};

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
  const [deviceDetails, setDeviceDetails] = useState<DeviceDetails | null>(null);
  useEffect(() => {
    if (prices.length > 0 && !selectedCondition) {
      setSelectedCondition(prices[0].conditionSlug);
    }
  }, [prices, selectedCondition]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
  const deviceImg = deviceImages[deviceData.slug] || deviceData.imageUrl || "";

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Link href="/sell" className="hover:text-zinc-600 transition-colors">Sell</Link>
            <span>/</span>
            <Link href={`/sell/${category}`} className="hover:text-zinc-600 transition-colors capitalize">{category}</Link>
            <span>/</span>
            <Link href={`/sell/${category}/${brand}`} className="hover:text-zinc-600 transition-colors capitalize">{brand}</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">{deviceData.name}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          <div>
            <div className="aspect-square rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden">
              {deviceImg ? (
                <img
                  src={deviceImg}
                  alt={deviceData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-32 h-32 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">{brand}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 font-serif leading-tight">
              {deviceData.name}
            </h1>
            <p className="text-lg text-zinc-500 mt-2">
              Up to <span className="text-zinc-900 font-bold">${((deviceData.maxQuoteCents ?? 0) / 100).toLocaleString()}</span>
            </p>

            <hr className="my-6 border-zinc-200" />

            <div>
              <h2 className="text-base font-semibold text-zinc-900 mb-4">
                Select Condition
              </h2>
              <ConditionSelector
                conditions={conditions}
                selected={selectedCondition}
                onSelect={setSelectedCondition}
              />
            </div>

            <hr className="my-6 border-zinc-200" />

            <div>
              <h2 className="text-base font-semibold text-zinc-900 mb-4">
                Device Details
              </h2>
              <DeviceDetailsForm
                deviceSlug={deviceData.slug}
                deviceName={deviceData.name}
                onChange={setDeviceDetails}
              />
            </div>

            <hr className="my-6 border-zinc-200" />

            <QuoteDisplay
              priceCents={currentPrice}
              deviceName={deviceData.name}
              conditionLabel={currentCondition?.label}
            />

            <div className="mt-4">
              <AddToBoxButton
                conditionSlug={selectedCondition}
              />
            </div>

            <div className="mt-6 bg-zinc-50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-zinc-900">Why sell to us?</p>
              <ul className="space-y-1.5 text-sm text-zinc-500">
                {[
                  "Free shipping with prepaid label",
                  "Fast payment within 24-48 hours",
                  "Safe & secure data wiping",
                  "21-day locked-in quote",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
