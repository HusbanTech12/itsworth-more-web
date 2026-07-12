"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  slug: string;
  name: string;
}

interface Brand {
  id: number;
  slug: string;
  name: string;
}

interface Device {
  id: number;
  slug: string;
  name: string;
}

const conditions = [
  { slug: "flawless", label: "Flawless", icon: "⚡" },
  { slug: "good", label: "Good", icon: "👍" },
  { slug: "fair", label: "Fair", icon: "🙂" },
  { slug: "broken", label: "Broken", icon: "✖" },
];

const carrierOptions = [
  { value: "unlocked", label: "Unlocked" },
  { value: "att", label: "AT&T" },
  { value: "verizon", label: "Verizon" },
  { value: "tmobile", label: "T-Mobile" },
];

const storageOptions = [
  { value: "128", label: "128GB" },
  { value: "256", label: "256GB" },
  { value: "512", label: "512GB" },
  { value: "1024", label: "1TB" },
];

export function HeroSection() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("128");
  const [selectedCarrier, setSelectedCarrier] = useState("unlocked");
  const [selectedCondition, setSelectedCondition] = useState("flawless");
  const [loadingDevices, setLoadingDevices] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setDevices([]);
      setSelectedDevice("");
      return;
    }
    setLoadingDevices(true);
    setSelectedDevice("");
    fetch(`/api/categories/${selectedCategory}/brands`)
      .then((r) => r.json())
      .then(async (data) => {
        const brands: Brand[] = data.brands || [];
        if (brands.length > 0) {
          const results = await Promise.all(
            brands.map((b) =>
              fetch(`/api/brands/${b.slug}/devices`).then((r) => r.json()),
            ),
          );
          const allDevices = results.flatMap((r) => r.devices || []);
          setDevices(allDevices);
        } else {
          setDevices([]);
        }
      })
      .catch(() => setDevices([]))
      .finally(() => setLoadingDevices(false));
  }, [selectedCategory]);

  function handleSubmit() {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedDevice) params.set("device", selectedDevice);
    if (selectedCondition) params.set("condition", selectedCondition);
    router.push(`/sell?${params.toString()}`);
  }

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-lime text-ink px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                <span aria-hidden="true">•</span>
                INSTANT OFFERS · PAID IN 24 HOURS
              </span>
            </div>

            <h1 className="animate-slide-up mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-ink">
              Your old tech
              <br />
              is worth{" "}
              <span className="text-orange">real</span>
              <br />
              <span className="text-orange">cash.</span>
            </h1>

            <p className="animate-slide-up mt-6 text-lg text-ink-muted max-w-lg leading-relaxed" style={{ animationDelay: "0.1s" }}>
              Select your device, pick its condition, and get a no-haggle instant offer. No strangers, no auctions, no drama.
            </p>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div
              className="bg-ink rounded-2xl p-8"
              style={{ boxShadow: "6px 6px 0 var(--color-orange)" }}
            >
            <p className="text-xs font-bold uppercase tracking-widest text-lime text-left mb-3">
              WHAT ARE YOU SELLING?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                aria-label="Select category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-11 rounded-md bg-ink-muted/10 border border-white/10 text-white px-3 text-sm appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "14px",
                }}
              >
                <option value="" disabled className="bg-ink text-white/50">
                  Select category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug} className="bg-ink text-white">
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                aria-label="Select model"
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                disabled={!selectedCategory || loadingDevices}
                className="w-full h-11 rounded-md bg-ink-muted/10 border border-white/10 text-white px-3 text-sm appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-lime disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "14px",
                }}
              >
                <option value="" disabled className="bg-ink text-white/50">
                  {loadingDevices ? "Loading..." : "Select model"}
                </option>
                {devices.map((d) => (
                  <option key={d.id} value={d.slug} className="bg-ink text-white">
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <select
                aria-label="Storage capacity"
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
                className="w-full h-11 rounded-md bg-ink-muted/10 border border-white/10 text-white px-3 text-sm appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "14px",
                }}
              >
                {storageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-ink text-white">
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                aria-label="Carrier or lock status"
                value={selectedCarrier}
                onChange={(e) => setSelectedCarrier(e.target.value)}
                className="w-full h-11 rounded-md bg-ink-muted/10 border border-white/10 text-white px-3 text-sm appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "14px",
                }}
              >
                {carrierOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-ink text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-lime text-left mt-6 mb-3">
              DEVICE CONDITION?
            </p>

            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Device condition">
              {conditions.map((c) => {
                const isSelected = selectedCondition === c.slug;
                return (
                  <button
                    key={c.slug}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedCondition(c.slug)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime ${
                      isSelected
                        ? "bg-lime text-ink font-bold"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {c.icon} {c.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 w-full py-4 rounded-md bg-orange text-white font-bold uppercase tracking-wide hover:brightness-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
            >
              GET MY INSTANT OFFER →
            </button>

            <p className="mt-3 text-xs text-white/50 text-center">
              Free shipping · No obligation · Offer locked 21 days
            </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
