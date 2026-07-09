"use client";

import { useState, useEffect, useCallback } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
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

interface DeviceDetails {
  storage: string;
  color: string;
  carrier: string;
  imei: string;
  serialNumber: string;
  hasCharger: boolean;
  hasCable: boolean;
  hasBox: boolean;
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

const storageOptionsMap: Record<string, { value: string; label: string }[]> = {
  "iphone-17-pro-max": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "iphone-17-pro": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "iphone-17": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-17e": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-16-pro-max": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "iphone-16-pro": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "iphone-16": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-16-plus": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-15-pro-max": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "iphone-15-pro": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-15": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-14-pro-max": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "iphone-14": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-13": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-13-mini": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-12": [
    { value: "64", label: "64GB" },
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
  ],
  "iphone-se-3rd-gen": [
    { value: "64", label: "64GB" },
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
  ],
  "galaxy-s25-ultra": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "galaxy-s25-plus": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "galaxy-s25": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
  ],
  "galaxy-s24-ultra": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "galaxy-z-fold-6": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "galaxy-z-flip-6": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "pixel-9-pro": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "pixel-9": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
  ],
  "ipad-pro-m4": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
    { value: "2048", label: "2TB" },
  ],
  "ipad-air-m2": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "macbook-pro-16-m4": [
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
    { value: "2048", label: "2TB" },
    { value: "4096", label: "4TB" },
  ],
  "macbook-air-15-m4": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
};

const defaultStorageMap: Record<string, string> = {
  "iphone-17-pro-max": "256",
  "iphone-17-pro": "256",
  "iphone-16-pro-max": "256",
  "iphone-16-pro": "128",
  "iphone-15-pro-max": "256",
  "iphone-15-pro": "128",
  "iphone-14-pro-max": "128",
  "iphone-12": "128",
  "iphone-se-3rd-gen": "128",
  "galaxy-s25-ultra": "256",
  "galaxy-s25-plus": "256",
  "galaxy-s24-ultra": "256",
  "galaxy-z-fold-6": "256",
  "galaxy-z-flip-6": "256",
  "ipad-pro-m4": "256",
  "ipad-air-m2": "128",
  "macbook-pro-16-m4": "512",
  "macbook-air-15-m4": "256",
};

const colorOptions = [
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "silver", label: "Silver" },
  { value: "space-gray", label: "Space Gray" },
  { value: "gold", label: "Gold" },
  { value: "rose-gold", label: "Rose Gold" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "green", label: "Green" },
  { value: "red", label: "Red" },
  { value: "graphite", label: "Graphite" },
  { value: "sierra-blue", label: "Sierra Blue" },
  { value: "alpine-green", label: "Alpine Green" },
  { value: "deep-purple", label: "Deep Purple" },
  { value: "titanium", label: "Titanium" },
];

const carrierOptions = [
  { value: "unlocked", label: "Unlocked" },
  { value: "att", label: "AT&T" },
  { value: "verizon", label: "Verizon" },
  { value: "tmobile", label: "T-Mobile" },
  { value: "sprint", label: "Sprint" },
  { value: "visible", label: "Visible" },
  { value: "cricket", label: "Cricket" },
  { value: "metro", label: "Metro by T-Mobile" },
  { value: "boost", label: "Boost Mobile" },
  { value: "other", label: "Other" },
];

const steps = [
  { num: 1, label: "Condition" },
  { num: 2, label: "Specs" },
  { num: 3, label: "Identification" },
  { num: 4, label: "Accessories" },
  { num: 5, label: "Review" },
];

export default function DevicePage() {
  const params = useParams();
  const category = params.category as string;
  const brand = params.brand as string;
  const device = params.device as string;

  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

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
  const [details, setDetails] = useState<DeviceDetails>({
    storage: "128",
    color: "",
    carrier: "",
    imei: "",
    serialNumber: "",
    hasCharger: true,
    hasCable: true,
    hasBox: false,
  });

  useEffect(() => {
    if (prices.length > 0 && !selectedCondition) {
      setSelectedCondition(prices[0].conditionSlug);
    }
  }, [prices, selectedCondition]);

  useEffect(() => {
    if (deviceData) {
      const def = defaultStorageMap[deviceData.slug] || "128";
      setDetails((prev) => ({ ...prev, storage: def }));
    }
  }, [deviceData]);

  const updateDetails = useCallback((updates: Partial<DeviceDetails>) => {
    setDetails((prev) => ({ ...prev, ...updates }));
  }, []);

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

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return !!selectedCondition;
      case 2:
        return !!details.storage && !!details.color;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  }

  function formatCents(c: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(c / 100);
  }

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
            <p className="text-sm text-zinc-500 mt-1">
              Up to <span className="text-zinc-900 font-bold">${((deviceData.maxQuoteCents ?? 0) / 100).toLocaleString()}</span>
            </p>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                {steps.map((s, i) => (
                  <div key={s.num} className="flex items-center">
                    <button
                      onClick={() => s.num < step && setStep(s.num)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        s.num === step
                          ? "text-primary"
                          : s.num < step
                            ? "text-emerald-600 cursor-pointer hover:text-emerald-700"
                            : "text-zinc-300 cursor-default"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold border-2 transition-colors ${
                          s.num === step
                            ? "border-primary bg-primary/10 text-primary"
                            : s.num < step
                              ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                              : "border-zinc-200 bg-white text-zinc-300"
                        }`}
                      >
                        {s.num < step ? (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          s.num
                        )}
                      </span>
                      <span className="hidden sm:inline">{s.label}</span>
                    </button>
                    {i < steps.length - 1 && (
                      <div
                        className={`mx-2 w-8 sm:w-12 h-px transition-colors ${
                          s.num < step ? "bg-emerald-300" : "bg-zinc-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-6 border-zinc-200" />

            <div className="min-h-[280px]">
              {step === 1 && (
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
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-base font-semibold text-zinc-900 mb-4">
                    Device Specs
                  </h2>
                  <p className="text-sm text-zinc-500 mb-5">
                    Tell us about your {deviceData.name}
                  </p>
                  <div className="space-y-4">
                    <Select
                      label="Storage"
                      options={storageOptionsMap[deviceData.slug] || [
                        { value: "128", label: "128GB" },
                        { value: "256", label: "256GB" },
                        { value: "512", label: "512GB" },
                      ]}
                      value={details.storage}
                      placeholder="Select storage"
                      onChange={(e) => updateDetails({ storage: e.target.value })}
                    />
                    <Select
                      label="Color"
                      options={colorOptions}
                      value={details.color}
                      placeholder="Select color"
                      onChange={(e) => updateDetails({ color: e.target.value })}
                    />
                    <Select
                      label="Carrier / Network"
                      options={carrierOptions}
                      value={details.carrier}
                      placeholder="Select carrier"
                      onChange={(e) => updateDetails({ carrier: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-base font-semibold text-zinc-900 mb-4">
                    Device Identification
                  </h2>
                  <p className="text-sm text-zinc-500 mb-5">
                    Helps us verify and process your device faster
                  </p>
                  <div className="space-y-4">
                    <Input
                      label="IMEI / MEID"
                      placeholder="Enter IMEI number"
                      value={details.imei}
                      onChange={(e) => updateDetails({ imei: e.target.value })}
                      helperText="15-17 digit number found in Settings > About Phone"
                    />
                    <Input
                      label="Serial Number"
                      placeholder="Enter serial number"
                      value={details.serialNumber}
                      onChange={(e) => updateDetails({ serialNumber: e.target.value })}
                      helperText="Optional — helps with device identification"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-base font-semibold text-zinc-900 mb-4">
                    Accessories
                  </h2>
                  <p className="text-sm text-zinc-500 mb-5">
                    Select which accessories you will include with your device
                  </p>
                  <div className="space-y-3">
                    {[
                      { key: "hasCharger" as const, label: "Charger", desc: "Original or compatible charging brick" },
                      { key: "hasCable" as const, label: "Charging Cable", desc: "USB-C, Lightning, or MagSafe cable" },
                      { key: "hasBox" as const, label: "Original Box", desc: "Original retail packaging" },
                    ].map((acc) => {
                      const checked = details[acc.key];
                      return (
                        <button
                          key={acc.key}
                          type="button"
                          onClick={() => updateDetails({ [acc.key]: !checked })}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                            checked
                              ? "border-primary bg-primary/5"
                              : "border-zinc-200 bg-white hover:border-zinc-300"
                          }`}
                        >
                          <span
                            className={`flex items-center justify-center w-5 h-5 rounded-md border-2 transition-colors ${
                              checked
                                ? "border-primary bg-primary text-white"
                                : "border-zinc-300 bg-white"
                            }`}
                          >
                            {checked && (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${checked ? "text-primary" : "text-zinc-900"}`}>
                              {acc.label}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">{acc.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 className="text-base font-semibold text-zinc-900 mb-4">
                    Review Your Device
                  </h2>
                  <div className="space-y-3">
                    {[
                      { label: "Device", value: deviceData.name },
                      { label: "Condition", value: currentCondition?.label },
                      { label: "Storage", value: details.storage ? `${details.storage}GB` : "—" },
                      { label: "Color", value: details.color ? colorOptions.find((c) => c.value === details.color)?.label || details.color : "—" },
                      { label: "Carrier", value: details.carrier ? carrierOptions.find((c) => c.value === details.carrier)?.label || details.carrier : "—" },
                      { label: "IMEI", value: details.imei || "—" },
                      { label: "Accessories", value: [details.hasCharger && "Charger", details.hasCable && "Cable", details.hasBox && "Box"].filter(Boolean).join(", ") || "None" },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center justify-between py-2">
                        <span className="text-sm text-zinc-500">{r.label}</span>
                        <span className="text-sm font-medium text-zinc-900 text-right">{r.value}</span>
                      </div>
                    ))}
                    <hr className="border-zinc-200" />
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm font-semibold text-zinc-900">Your Quote</span>
                      <span className="text-lg font-bold text-primary">{currentPrice > 0 ? formatCents(currentPrice) : "—"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <hr className="my-6 border-zinc-200" />

            {step < 5 && (
              <div className="flex items-center gap-3">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M19 12H5m7-7l-7 7 7 7" />
                    </svg>
                    Back
                  </button>
                )}
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all ${
                    canProceed()
                      ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                      : "bg-zinc-100 text-zinc-300 cursor-not-allowed"
                  }`}
                >
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M5 12h14m-7-7l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-3">
                <AddToBoxButton
                  conditionSlug={selectedCondition}
                />
                <button
                  onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-500 hover:bg-zinc-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                  </svg>
                  Edit Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
