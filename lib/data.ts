export interface Category {
  slug: string;
  name: string;
  icon: string;
  description: string;
}

export interface Brand {
  slug: string;
  name: string;
  imageUrl: string;
  categorySlug: string;
}

export interface Device {
  slug: string;
  name: string;
  imageUrl: string;
  brandSlug: string;
  maxQuoteCents: number;
}

export interface Condition {
  slug: string;
  label: string;
  description: string;
  priceCents: number;
}

export const categories: Category[] = [
  { slug: "phone", name: "Mobile Phones", icon: "📱", description: "Smartphones & feature phones" },
  { slug: "tablet", name: "Tablets", icon: "📟", description: "iPads, Android tablets & more" },
  { slug: "laptop", name: "Laptops", icon: "💻", description: "MacBooks, Windows laptops & Chromebooks" },
  { slug: "desktop", name: "Desktops", icon: "🖥️", description: "iMacs, PCs & workstations" },
  { slug: "smart-watch", name: "Smartwatches", icon: "⌚", description: "Apple Watch, Galaxy Watch & more" },
  { slug: "game-console", name: "Game Consoles", icon: "🎮", description: "PlayStation, Xbox, Nintendo" },
  { slug: "graphics-card", name: "Graphics Cards", icon: "🎯", description: "NVIDIA, AMD & more" },
  { slug: "camera", name: "Cameras", icon: "📷", description: "DSLR, mirrorless & point-and-shoot" },
  { slug: "audio", name: "Audio", icon: "🎧", description: "Headphones, speakers & earbuds" },
  { slug: "drone", name: "Drones", icon: "🛸", description: "DJI, Autel & consumer drones" },
  { slug: "vr", name: "VR Headsets", icon: "🥽", description: "Meta Quest, PlayStation VR & more" },
  { slug: "monitor", name: "Monitors", icon: "🖥️", description: "Computer monitors & displays" },
];

export const brands: Brand[] = [
  { slug: "iphone", name: "iPhone", imageUrl: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=200&q=80&fit=crop&auto=format", categorySlug: "phone" },
  { slug: "samsung", name: "Samsung", imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&q=80&fit=crop&auto=format", categorySlug: "phone" },
  { slug: "google-phone", name: "Google", imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200&q=80&fit=crop&auto=format", categorySlug: "phone" },
  { slug: "oneplus", name: "OnePlus", imageUrl: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=200&q=80&fit=crop&auto=format", categorySlug: "phone" },
  { slug: "motorola", name: "Motorola", imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200&q=80&fit=crop&auto=format", categorySlug: "phone" },
  { slug: "ipad", name: "iPad", imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80&fit=crop&auto=format", categorySlug: "tablet" },
  { slug: "samsung-tablet", name: "Samsung Tablet", imageUrl: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=200&q=80&fit=crop&auto=format", categorySlug: "tablet" },
  { slug: "macbook", name: "MacBook", imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80&fit=crop&auto=format", categorySlug: "laptop" },
  { slug: "apple-watch", name: "Apple Watch", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&fit=crop&auto=format", categorySlug: "smart-watch" },
];

export const devices: Device[] = [
  { slug: "iphone-17-pro-max", name: "iPhone 17 Pro Max", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 135500 },
  { slug: "iphone-17-pro", name: "iPhone 17 Pro", imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 107500 },
  { slug: "iphone-17", name: "iPhone 17", imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 73000 },
  { slug: "iphone-17e", name: "iPhone 17e", imageUrl: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 47000 },
  { slug: "iphone-16-pro-max", name: "iPhone 16 Pro Max", imageUrl: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 89000 },
  { slug: "iphone-16-pro", name: "iPhone 16 Pro", imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 68000 },
  { slug: "iphone-16", name: "iPhone 16", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 62500 },
  { slug: "iphone-16-plus", name: "iPhone 16 Plus", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 59500 },
  { slug: "iphone-15-pro-max", name: "iPhone 15 Pro Max", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 60500 },
  { slug: "iphone-15-pro", name: "iPhone 15 Pro", imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 56000 },
  { slug: "iphone-15", name: "iPhone 15", imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 44500 },
  { slug: "iphone-14-pro-max", name: "iPhone 14 Pro Max", imageUrl: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 48000 },
  { slug: "iphone-14", name: "iPhone 14", imageUrl: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 29700 },
  { slug: "iphone-13", name: "iPhone 13", imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 30500 },
  { slug: "iphone-13-mini", name: "iPhone 13 Mini", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 23500 },
  { slug: "iphone-12", name: "iPhone 12", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 17500 },
  { slug: "iphone-se-3rd-gen", name: "iPhone SE (3rd Gen.)", imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&q=80&fit=crop&auto=format", brandSlug: "iphone", maxQuoteCents: 10000 },
  { slug: "galaxy-s25-ultra", name: "Galaxy S25 Ultra", imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&q=80&fit=crop&auto=format", brandSlug: "samsung", maxQuoteCents: 72000 },
  { slug: "galaxy-s25-plus", name: "Galaxy S25+", imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&q=80&fit=crop&auto=format", brandSlug: "samsung", maxQuoteCents: 55000 },
  { slug: "galaxy-s25", name: "Galaxy S25", imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&q=80&fit=crop&auto=format", brandSlug: "samsung", maxQuoteCents: 45000 },
  { slug: "galaxy-s24-ultra", name: "Galaxy S24 Ultra", imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&q=80&fit=crop&auto=format", brandSlug: "samsung", maxQuoteCents: 62000 },
  { slug: "galaxy-z-fold-6", name: "Galaxy Z Fold 6", imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&q=80&fit=crop&auto=format", brandSlug: "samsung", maxQuoteCents: 75000 },
  { slug: "galaxy-z-flip-6", name: "Galaxy Z Flip 6", imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&q=80&fit=crop&auto=format", brandSlug: "samsung", maxQuoteCents: 48000 },
  { slug: "pixel-9-pro", name: "Pixel 9 Pro", imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&q=80&fit=crop&auto=format", brandSlug: "google-phone", maxQuoteCents: 45000 },
  { slug: "pixel-9", name: "Pixel 9", imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&q=80&fit=crop&auto=format", brandSlug: "google-phone", maxQuoteCents: 35000 },
  { slug: "ipad-pro-m4", name: "iPad Pro M4", imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80&fit=crop&auto=format", brandSlug: "ipad", maxQuoteCents: 65000 },
  { slug: "ipad-air-m2", name: "iPad Air M2", imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80&fit=crop&auto=format", brandSlug: "ipad", maxQuoteCents: 42000 },
  { slug: "macbook-pro-16-m4", name: "MacBook Pro 16\" M4", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80&fit=crop&auto=format", brandSlug: "macbook", maxQuoteCents: 145000 },
  { slug: "macbook-air-15-m4", name: "MacBook Air 15\" M4", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80&fit=crop&auto=format", brandSlug: "macbook", maxQuoteCents: 85000 },
];

export const conditions: Record<string, { slug: string; label: string; description: string }> = {
  "brand-new": { slug: "brand-new", label: "Brand New", description: "Still in factory original packaging. Never activated." },
  "flawless": { slug: "flawless", label: "Flawless", description: "Zero scratches, scuffs, or other marks. Looks like new." },
  "good": { slug: "good", label: "Good", description: "Light to moderate signs of wear. Few light scratches." },
  "fair": { slug: "fair", label: "Fair", description: "Moderate to excessive signs of wear. Heavy scratches." },
  "broken": { slug: "broken", label: "Broken", description: "Functionally defective or broken parts." },
};

const priceData: Record<string, Record<string, number>> = {
  "iphone-17-pro-max": { "brand-new": 135500, "flawless": 125000, "good": 110000, "fair": 85000, "broken": 45000 },
  "iphone-17-pro": { "brand-new": 107500, "flawless": 98000, "good": 86000, "fair": 65000, "broken": 35000 },
  "iphone-17": { "brand-new": 73000, "flawless": 67000, "good": 58000, "fair": 42000, "broken": 20000 },
  "iphone-17e": { "brand-new": 47000, "flawless": 43000, "good": 37000, "fair": 25000, "broken": 12000 },
  "iphone-16-pro-max": { "brand-new": 89000, "flawless": 82000, "good": 72000, "fair": 55000, "broken": 30000 },
  "iphone-16-pro": { "brand-new": 68000, "flawless": 62000, "good": 54000, "fair": 40000, "broken": 22000 },
  "iphone-16": { "brand-new": 62500, "flawless": 57000, "good": 49000, "fair": 35000, "broken": 18000 },
  "iphone-16-plus": { "brand-new": 59500, "flawless": 54000, "good": 46000, "fair": 32000, "broken": 17000 },
  "iphone-15-pro-max": { "brand-new": 60500, "flawless": 55000, "good": 47000, "fair": 33000, "broken": 18000 },
  "iphone-15-pro": { "brand-new": 56000, "flawless": 51000, "good": 43000, "fair": 30000, "broken": 16000 },
  "iphone-15": { "brand-new": 44500, "flawless": 40000, "good": 34000, "fair": 23000, "broken": 12000 },
  "iphone-14-pro-max": { "brand-new": 48000, "flawless": 44000, "good": 37000, "fair": 25000, "broken": 13000 },
  "iphone-14": { "brand-new": 29700, "flawless": 27000, "good": 22000, "fair": 14000, "broken": 7000 },
  "iphone-13": { "brand-new": 30500, "flawless": 28000, "good": 23000, "fair": 15000, "broken": 8000 },
  "iphone-13-mini": { "brand-new": 23500, "flawless": 21000, "good": 17000, "fair": 10000, "broken": 5000 },
  "iphone-12": { "brand-new": 17500, "flawless": 16000, "good": 13000, "fair": 8000, "broken": 4000 },
  "iphone-se-3rd-gen": { "brand-new": 10000, "flawless": 9000, "good": 7000, "fair": 4000, "broken": 2000 },
  "galaxy-s25-ultra": { "brand-new": 72000, "flawless": 66000, "good": 57000, "fair": 42000, "broken": 22000 },
  "galaxy-s25-plus": { "brand-new": 55000, "flawless": 50000, "good": 43000, "fair": 30000, "broken": 15000 },
  "galaxy-s25": { "brand-new": 45000, "flawless": 41000, "good": 35000, "fair": 25000, "broken": 12000 },
  "galaxy-s24-ultra": { "brand-new": 62000, "flawless": 57000, "good": 48000, "fair": 34000, "broken": 18000 },
  "galaxy-z-fold-6": { "brand-new": 75000, "flawless": 69000, "good": 59000, "fair": 42000, "broken": 22000 },
  "galaxy-z-flip-6": { "brand-new": 48000, "flawless": 44000, "good": 37000, "fair": 25000, "broken": 13000 },
  "pixel-9-pro": { "brand-new": 45000, "flawless": 41000, "good": 35000, "fair": 24000, "broken": 12000 },
  "pixel-9": { "brand-new": 35000, "flawless": 32000, "good": 27000, "fair": 18000, "broken": 9000 },
  "ipad-pro-m4": { "brand-new": 65000, "flawless": 60000, "good": 51000, "fair": 37000, "broken": 19000 },
  "ipad-air-m2": { "brand-new": 42000, "flawless": 38000, "good": 32000, "fair": 22000, "broken": 11000 },
  'macbook-pro-16-m4': { "brand-new": 145000, "flawless": 133000, "good": 115000, "fair": 85000, "broken": 45000 },
  'macbook-air-15-m4': { "brand-new": 85000, "flawless": 78000, "good": 66000, "fair": 48000, "broken": 25000 },
};

export function getDevicesByBrand(brandSlug: string) {
  return devices.filter((d) => d.brandSlug === brandSlug);
}

export function getBrandsByCategory(categorySlug: string) {
  return brands.filter((b) => b.categorySlug === categorySlug);
}

export function getDevicePrices(deviceSlug: string) {
  const prices = priceData[deviceSlug];
  if (!prices) return [];
  return Object.entries(prices).map(([slug, priceCents]) => ({
    ...conditions[slug],
    slug,
    priceCents,
  }));
}
