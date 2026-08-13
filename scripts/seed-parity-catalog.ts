/**
 * Idempotent IWM-parity catalog fill — missing brands/models + professional Unsplash images.
 * Does NOT truncate. Skips existing device slugs. Updates null imageUrls on re-run for listed slugs.
 *
 * Run: npx tsx --env-file=.env scripts/seed-parity-catalog.ts
 */
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";

const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
  prepare: false,
});
const db = drizzle(sql, { schema });

interface DevSpec {
  slug: string;
  name: string;
  maxDollars: number;
  imageUrl: string;
}

interface BrandSpec {
  slug: string;
  name: string;
  categorySlug: string;
  imageUrl: string;
  devices: Omit<DevSpec, "imageUrl">[];
  deviceImages: string[];
}

const U = (id: string, w = 300) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&fit=crop&auto=format`;

const PHONE_IMGS = [
  U("photo-1511707171634-5f897ff02aa9"),
  U("photo-1512496015851-a90fb38ba796"),
  U("photo-1601784551446-20c9e07cdbdb"),
  U("photo-1546054454-aa26e2b734c7"),
  U("photo-1505236858219-8359eb29e329"),
  U("photo-1579586337278-3befd40fd17a"),
  U("photo-1592890288564-7668b47bb5ee"),
  U("photo-1580910051074-3eb694886505"),
];
const TABLET_IMGS = [
  U("photo-1544244015-0df4b3ffc6b0"),
  U("photo-1561154464-82e9adf32764"),
  U("photo-1585790050230-5dd28404ccb9"),
  U("photo-1542751371-adc38448a05e"),
];
const LAPTOP_IMGS = [
  U("photo-1496181133206-80ce9b88a853"),
  U("photo-1517336714731-489689fd1ca8"),
  U("photo-1525547719571-a2d4ac8945e2"),
  U("photo-1588872657578-7efd1f1555ed"),
  U("photo-1593642632823-8f785ba67e45"),
];
const CONSOLE_IMGS = [
  U("photo-1606144042614-b2417e99c4e3"),
  U("photo-1621259182978-fbf93132d53d"),
  U("photo-1486401899868-0e435ed85128"),
  U("photo-1612287230202-1ff1d85d1bdf"),
];
const GPU_IMGS = [
  U("photo-1591488320449-011701bb6704"),
  U("photo-1587202372634-32705e3bf56c"),
  U("photo-1555617981-dac3880eac6e"),
];
const MONITOR_IMGS = [
  U("photo-1527443224154-c4a3942d3acf"),
  U("photo-1585790050230-5dd28404ccb9"),
  U("photo-1593640408182-31c70c8268f5"),
];
const DRONE_IMGS = [
  U("photo-1473968512647-3e447244af8f"),
  U("photo-1508444845599-5b8999636f3f"),
  U("photo-1527979809421-cdd1455c8c85"),
];
const DESKTOP_IMGS = [
  U("photo-1527443224154-c4a3942d3acf"),
  U("photo-1593640408182-31c70c8268f5"),
  U("photo-1587836374828-4ceb853a3b99"),
];
const WATCH_IMGS = [
  U("photo-1434493789847-2f02dc6ca35d"),
  U("photo-1579586337278-3befd40fd17a"),
  U("photo-1508685096489-7aacd43bd3b1"),
];
const AUDIO_IMGS = [
  U("photo-1505740420928-5e560c06d30e"),
  U("photo-1484704849700-f032a97bd089"),
  U("photo-1546435770-a3e426bf472b"),
  U("photo-1590658268037-6bf12165a8df"),
];
const VR_IMGS = [
  U("photo-1622979135225-d2ba269cf1ac"),
  U("photo-1617802690992-15d93263d3a9"),
  U("photo-1593508512255-86ab42a8e620"),
];

function pick(imgs: string[], i: number) {
  return imgs[i % imgs.length];
}

function tiers(maxCents: number) {
  return {
    "brand-new": Math.round(maxCents * 1.05),
    flawless: maxCents,
    "very-good": Math.round(maxCents * 0.88),
    good: Math.round(maxCents * 0.75),
    fair: Math.round(maxCents * 0.55),
    broken: Math.round(maxCents * 0.25),
  };
}

function brand(
  slug: string,
  name: string,
  categorySlug: string,
  brandImg: string,
  deviceImages: string[],
  devices: { slug: string; name: string; maxDollars: number }[],
): BrandSpec {
  return { slug, name, categorySlug, imageUrl: brandImg, deviceImages, devices };
}

/** Missing models vs IWM-style coverage — placeholder prices, professional Unsplash images */
export const parityCatalog: BrandSpec[] = [
  // ── iPhone missing models ──
  brand("iphone", "iPhone", "phone", U("photo-1546054454-aa26e2b734c7", 200), PHONE_IMGS, [
    { slug: "iphone-air", name: "iPhone Air", maxDollars: 820 },
    { slug: "iphone-16e", name: "iPhone 16e", maxDollars: 440 },
    { slug: "iphone-15-plus", name: "iPhone 15 Plus", maxDollars: 480 },
    { slug: "iphone-14-pro", name: "iPhone 14 Pro", maxDollars: 400 },
    { slug: "iphone-14-plus", name: "iPhone 14 Plus", maxDollars: 320 },
    { slug: "iphone-13-pro-max", name: "iPhone 13 Pro Max", maxDollars: 510 },
    { slug: "iphone-13-pro", name: "iPhone 13 Pro", maxDollars: 460 },
    { slug: "iphone-12-pro-max", name: "iPhone 12 Pro Max", maxDollars: 340 },
    { slug: "iphone-12-pro", name: "iPhone 12 Pro", maxDollars: 245 },
    { slug: "iphone-12-mini", name: "iPhone 12 mini", maxDollars: 125 },
    { slug: "iphone-11-pro-max", name: "iPhone 11 Pro Max", maxDollars: 240 },
    { slug: "iphone-11-pro", name: "iPhone 11 Pro", maxDollars: 190 },
    { slug: "iphone-xs-max", name: "iPhone XS Max", maxDollars: 200 },
    { slug: "iphone-xs", name: "iPhone XS", maxDollars: 80 },
  ]),

  // ── Samsung phones ──
  brand("samsung", "Samsung", "phone", U("photo-1610945265064-0e34e5519bbf", 200), PHONE_IMGS, [
    { slug: "galaxy-s24-plus", name: "Galaxy S24+", maxDollars: 480 },
    { slug: "galaxy-s24", name: "Galaxy S24", maxDollars: 380 },
    { slug: "galaxy-s23-ultra", name: "Galaxy S23 Ultra", maxDollars: 420 },
    { slug: "galaxy-s23-plus", name: "Galaxy S23+", maxDollars: 300 },
    { slug: "galaxy-s23", name: "Galaxy S23", maxDollars: 250 },
    { slug: "galaxy-s22-ultra", name: "Galaxy S22 Ultra", maxDollars: 280 },
    { slug: "galaxy-s22", name: "Galaxy S22", maxDollars: 160 },
    { slug: "galaxy-z-fold-5", name: "Galaxy Z Fold 5", maxDollars: 550 },
    { slug: "galaxy-z-flip-5", name: "Galaxy Z Flip 5", maxDollars: 320 },
    { slug: "galaxy-z-fold-4", name: "Galaxy Z Fold 4", maxDollars: 380 },
    { slug: "galaxy-z-flip-4", name: "Galaxy Z Flip 4", maxDollars: 200 },
    { slug: "galaxy-a55", name: "Galaxy A55", maxDollars: 180 },
    { slug: "galaxy-a35", name: "Galaxy A35", maxDollars: 120 },
    { slug: "galaxy-a15", name: "Galaxy A15", maxDollars: 70 },
  ]),

  // ── Google Pixel full line ──
  brand("google-phone", "Google", "phone", U("photo-1579586337278-3befd40fd17a", 200), PHONE_IMGS, [
    { slug: "pixel-10-pro-fold", name: "Pixel 10 Pro Fold", maxDollars: 920 },
    { slug: "pixel-10-pro-xl", name: "Pixel 10 Pro XL", maxDollars: 510 },
    { slug: "pixel-10-pro", name: "Pixel 10 Pro", maxDollars: 500 },
    { slug: "pixel-10", name: "Pixel 10", maxDollars: 340 },
    { slug: "pixel-10a", name: "Pixel 10a", maxDollars: 270 },
    { slug: "pixel-9-pro-fold", name: "Pixel 9 Pro Fold", maxDollars: 600 },
    { slug: "pixel-9-pro-xl", name: "Pixel 9 Pro XL", maxDollars: 420 },
    { slug: "pixel-9a", name: "Pixel 9a", maxDollars: 240 },
    { slug: "pixel-8-pro", name: "Pixel 8 Pro", maxDollars: 290 },
    { slug: "pixel-8", name: "Pixel 8", maxDollars: 200 },
    { slug: "pixel-8a", name: "Pixel 8a", maxDollars: 210 },
    { slug: "pixel-fold", name: "Pixel Fold", maxDollars: 260 },
    { slug: "pixel-7-pro", name: "Pixel 7 Pro", maxDollars: 175 },
    { slug: "pixel-7", name: "Pixel 7", maxDollars: 130 },
    { slug: "pixel-7a", name: "Pixel 7a", maxDollars: 120 },
    { slug: "pixel-6-pro", name: "Pixel 6 Pro", maxDollars: 125 },
    { slug: "pixel-6", name: "Pixel 6", maxDollars: 120 },
    { slug: "pixel-5", name: "Pixel 5", maxDollars: 55 },
    { slug: "pixel-5a", name: "Pixel 5a 5G", maxDollars: 50 },
    { slug: "pixel-4-xl", name: "Pixel 4 XL", maxDollars: 80 },
    { slug: "pixel-4a", name: "Pixel 4a", maxDollars: 25 },
  ]),

  // ── OnePlus older + newer ──
  brand("oneplus", "OnePlus", "phone", U("photo-1567581935884-3349723552ca", 200), PHONE_IMGS, [
    { slug: "oneplus-15", name: "OnePlus 15", maxDollars: 560 },
    { slug: "oneplus-15r", name: "OnePlus 15R", maxDollars: 410 },
    { slug: "oneplus-11", name: "OnePlus 11", maxDollars: 280 },
    { slug: "oneplus-10-pro", name: "OnePlus 10 Pro", maxDollars: 170 },
    { slug: "oneplus-10t", name: "OnePlus 10T 5G", maxDollars: 155 },
    { slug: "oneplus-9-pro", name: "OnePlus 9 Pro", maxDollars: 160 },
    { slug: "oneplus-9", name: "OnePlus 9", maxDollars: 105 },
    { slug: "oneplus-8-pro", name: "OnePlus 8 Pro", maxDollars: 110 },
    { slug: "oneplus-8t", name: "OnePlus 8T 5G", maxDollars: 70 },
    { slug: "oneplus-nord-ce-4", name: "OnePlus Nord CE 4", maxDollars: 140 },
  ]),

  // ── Motorola extras ──
  brand("motorola", "Motorola", "phone", U("photo-1601784551446-20c9e07cdbdb", 200), PHONE_IMGS, [
    { slug: "moto-edge-40-pro", name: "Motorola Edge 40 Pro", maxDollars: 200 },
    { slug: "moto-edge-30-ultra", name: "Motorola Edge 30 Ultra", maxDollars: 160 },
    { slug: "moto-g84", name: "Motorola G84", maxDollars: 90 },
    { slug: "moto-g54", name: "Motorola G54", maxDollars: 70 },
  ]),

  // ── Samsung tablets missing ──
  brand("samsung-tablet", "Samsung Tablet", "tablet", U("photo-1561154464-82e9adf32764", 200), TABLET_IMGS, [
    { slug: "galaxy-tab-s11-ultra", name: "Galaxy Tab S11 Ultra", maxDollars: 750 },
    { slug: "galaxy-tab-s11", name: "Galaxy Tab S11", maxDollars: 460 },
    { slug: "galaxy-tab-s10-lite", name: "Galaxy Tab S10 Lite", maxDollars: 200 },
    { slug: "galaxy-tab-s10-fe-plus", name: "Galaxy Tab S10 FE+", maxDollars: 300 },
    { slug: "galaxy-tab-s9-fe-plus", name: "Galaxy Tab S9 FE+", maxDollars: 225 },
    { slug: "galaxy-tab-s7-fe", name: "Galaxy Tab S7 FE", maxDollars: 200 },
    { slug: "galaxy-tab-s7-plus", name: "Galaxy Tab S7+", maxDollars: 215 },
    { slug: "galaxy-tab-s7", name: "Galaxy Tab S7", maxDollars: 200 },
    { slug: "galaxy-tab-s6-lite", name: "Galaxy Tab S6 Lite", maxDollars: 110 },
    { slug: "galaxy-tab-s6", name: "Galaxy Tab S6", maxDollars: 120 },
  ]),

  // ── OnePlus tablets (new brand) ──
  brand("oneplus-tablet", "OnePlus Tablet", "tablet", U("photo-1544244015-0df4b3ffc6b0", 200), TABLET_IMGS, [
    { slug: "oneplus-pad-3", name: "OnePlus Pad 3", maxDollars: 370 },
    { slug: "oneplus-pad-2", name: "OnePlus Pad 2", maxDollars: 220 },
    { slug: "oneplus-pad", name: "OnePlus Pad", maxDollars: 155 },
    { slug: "oneplus-pad-go-2", name: "OnePlus Pad Go 2", maxDollars: 220 },
  ]),

  // ── iPad missing modern models ──
  brand("ipad", "iPad", "tablet", U("photo-1544244015-0df4b3ffc6b0", 200), TABLET_IMGS, [
    { slug: "ipad-pro-m5", name: "iPad Pro M5", maxDollars: 900 },
    { slug: "ipad-air-m3", name: "iPad Air M3", maxDollars: 550 },
    { slug: "ipad-mini-7", name: "iPad Mini 7", maxDollars: 420 },
    { slug: "ipad-11", name: "iPad 11", maxDollars: 350 },
  ]),

  // ── Laptops: Windows brands (critical gap) ──
  brand("dell-laptop", "Dell", "laptop", U("photo-1593642632823-8f785ba67e45", 200), LAPTOP_IMGS, [
    { slug: "dell-xps-16-2024", name: "Dell XPS 16 (2024)", maxDollars: 1400 },
    { slug: "dell-xps-14-2024", name: "Dell XPS 14 (2024)", maxDollars: 1100 },
    { slug: "dell-xps-13-plus", name: "Dell XPS 13 Plus", maxDollars: 750 },
    { slug: "dell-latitude-7450", name: "Dell Latitude 7450", maxDollars: 650 },
    { slug: "dell-inspiron-16", name: "Dell Inspiron 16", maxDollars: 420 },
    { slug: "dell-g16-gaming", name: "Dell G16 Gaming", maxDollars: 700 },
  ]),
  brand("hp-laptop", "HP", "laptop", U("photo-1525547719571-a2d4ac8945e2", 200), LAPTOP_IMGS, [
    { slug: "hp-spectre-x360-14", name: "HP Spectre x360 14", maxDollars: 950 },
    { slug: "hp-envy-16", name: "HP Envy 16", maxDollars: 800 },
    { slug: "hp-pavilion-15", name: "HP Pavilion 15", maxDollars: 380 },
    { slug: "hp-elitebook-840-g11", name: "HP EliteBook 840 G11", maxDollars: 700 },
    { slug: "hp-omen-16", name: "HP Omen 16", maxDollars: 900 },
  ]),
  brand("lenovo-laptop", "Lenovo", "laptop", U("photo-1588872657578-7efd1f1555ed", 200), LAPTOP_IMGS, [
    { slug: "lenovo-thinkpad-x1-carbon-gen-12", name: "Lenovo ThinkPad X1 Carbon Gen 12", maxDollars: 1200 },
    { slug: "lenovo-yoga-9i", name: "Lenovo Yoga 9i", maxDollars: 850 },
    { slug: "lenovo-ideapad-pro-5", name: "Lenovo IdeaPad Pro 5", maxDollars: 550 },
    { slug: "lenovo-legion-pro-7i", name: "Lenovo Legion Pro 7i", maxDollars: 1400 },
    { slug: "lenovo-thinkpad-t14s", name: "Lenovo ThinkPad T14s", maxDollars: 750 },
  ]),
  brand("microsoft-laptop", "Microsoft", "laptop", U("photo-1496181133206-80ce9b88a853", 200), LAPTOP_IMGS, [
    { slug: "surface-laptop-7", name: "Surface Laptop 7", maxDollars: 1100 },
    { slug: "surface-laptop-studio-2", name: "Surface Laptop Studio 2", maxDollars: 1300 },
    { slug: "surface-pro-11", name: "Surface Pro 11", maxDollars: 900 },
    { slug: "surface-laptop-5", name: "Surface Laptop 5", maxDollars: 650 },
    { slug: "surface-go-4", name: "Surface Go 4", maxDollars: 320 },
  ]),
  brand("asus-laptop", "ASUS", "laptop", U("photo-1593642632823-8f785ba67e45", 200), LAPTOP_IMGS, [
    { slug: "asus-zenbook-14-oled", name: "ASUS Zenbook 14 OLED", maxDollars: 700 },
    { slug: "asus-vivobook-16", name: "ASUS Vivobook 16", maxDollars: 400 },
    { slug: "asus-rog-zephyrus-g16", name: "ASUS ROG Zephyrus G16", maxDollars: 1500 },
    { slug: "asus-rog-strix-g16", name: "ASUS ROG Strix G16", maxDollars: 1200 },
  ]),
  brand("acer-laptop", "Acer", "laptop", U("photo-1525547719571-a2d4ac8945e2", 200), LAPTOP_IMGS, [
    { slug: "acer-swift-go-14", name: "Acer Swift Go 14", maxDollars: 550 },
    { slug: "acer-aspire-5", name: "Acer Aspire 5", maxDollars: 320 },
    { slug: "acer-predator-helios-neo-16", name: "Acer Predator Helios Neo 16", maxDollars: 1000 },
  ]),
  brand("samsung-laptop", "Samsung", "laptop", U("photo-1517336714731-489689fd1ca8", 200), LAPTOP_IMGS, [
    { slug: "galaxy-book6-pro", name: "Samsung Galaxy Book6 Pro", maxDollars: 1400 },
    { slug: "galaxy-book5-pro", name: "Samsung Galaxy Book5 Pro", maxDollars: 900 },
    { slug: "galaxy-book4-pro", name: "Samsung Galaxy Book4 Pro", maxDollars: 750 },
    { slug: "galaxy-book3-pro", name: "Samsung Galaxy Book3 Pro", maxDollars: 550 },
  ]),
  brand("razer-laptop", "Razer", "laptop", U("photo-1593642632823-8f785ba67e45", 200), LAPTOP_IMGS, [
    { slug: "razer-blade-16", name: "Razer Blade 16", maxDollars: 1800 },
    { slug: "razer-blade-14", name: "Razer Blade 14", maxDollars: 1400 },
    { slug: "razer-blade-18", name: "Razer Blade 18", maxDollars: 2000 },
  ]),

  // ── MacBook modern extras ──
  brand("macbook", "MacBook", "laptop", U("photo-1517336714731-489689fd1ca8", 200), LAPTOP_IMGS, [
    { slug: "macbook-pro-14-m4", name: "MacBook Pro 14\" M4", maxDollars: 1300 },
    { slug: "macbook-pro-16-m3", name: "MacBook Pro 16\" M3", maxDollars: 1600 },
    { slug: "macbook-air-13-m3", name: "MacBook Air 13\" M3", maxDollars: 750 },
    { slug: "macbook-air-15-m3", name: "MacBook Air 15\" M3", maxDollars: 850 },
    { slug: "macbook-air-13-m2", name: "MacBook Air 13\" M2", maxDollars: 600 },
  ]),

  // ── Desktop extras ──
  brand("imac", "iMac", "desktop", U("photo-1527443224154-c4a3942d3acf", 200), DESKTOP_IMGS, [
    { slug: "imac-24-m4", name: "iMac 24\" M4", maxDollars: 1100 },
    { slug: "imac-24-m3", name: "iMac 24\" M3", maxDollars: 900 },
    { slug: "imac-24-2023-m1", name: "iMac 24\" (2023) M1", maxDollars: 700 },
  ]),
  brand("mac-studio", "Mac Studio", "desktop", U("photo-1593640408182-31c70c8268f5", 200), DESKTOP_IMGS, [
    { slug: "mac-studio-m2-max", name: "Mac Studio M2 Max", maxDollars: 1400 },
    { slug: "mac-studio-m2-ultra", name: "Mac Studio M2 Ultra", maxDollars: 2200 },
    { slug: "mac-studio-m4-max", name: "Mac Studio M4 Max", maxDollars: 1800 },
  ]),
  brand("mac-pro", "Mac Pro", "desktop", U("photo-1587836374828-4ceb853a3b99", 200), DESKTOP_IMGS, [
    { slug: "mac-pro-m2-ultra", name: "Mac Pro M2 Ultra", maxDollars: 3500 },
  ]),

  // ── Game consoles core ──
  brand("sony", "Sony", "game-console", U("photo-1606144042614-b2417e99c4e3", 200), CONSOLE_IMGS, [
    { slug: "playstation-5", name: "PlayStation 5", maxDollars: 350 },
    { slug: "playstation-5-slim", name: "PlayStation 5 Slim", maxDollars: 380 },
    { slug: "playstation-5-digital", name: "PlayStation 5 Digital Edition", maxDollars: 300 },
    { slug: "playstation-4-pro", name: "PlayStation 4 Pro", maxDollars: 140 },
    { slug: "playstation-4-slim", name: "PlayStation 4 Slim", maxDollars: 100 },
  ]),
  brand("xbox", "Xbox", "game-console", U("photo-1621259182978-fbf93132d53d", 200), CONSOLE_IMGS, [
    { slug: "xbox-series-x", name: "Xbox Series X", maxDollars: 340 },
    { slug: "xbox-series-s", name: "Xbox Series S", maxDollars: 180 },
    { slug: "xbox-one-x", name: "Xbox One X", maxDollars: 120 },
    { slug: "xbox-one-s", name: "Xbox One S", maxDollars: 80 },
  ]),
  brand("nintendo", "Nintendo", "game-console", U("photo-1612287230202-1ff1d85d1bdf", 200), CONSOLE_IMGS, [
    { slug: "nintendo-switch-2", name: "Nintendo Switch 2", maxDollars: 380 },
    { slug: "nintendo-switch-oled", name: "Nintendo Switch OLED", maxDollars: 220 },
    { slug: "nintendo-switch", name: "Nintendo Switch", maxDollars: 160 },
    { slug: "nintendo-switch-lite", name: "Nintendo Switch Lite", maxDollars: 110 },
  ]),

  // ── Graphics cards ──
  brand("nvidia", "NVIDIA", "graphics-card", U("photo-1591488320449-011701bb6704", 200), GPU_IMGS, [
    { slug: "rtx-4090", name: "GeForce RTX 4090 24GB", maxDollars: 1400 },
    { slug: "rtx-4080-super", name: "GeForce RTX 4080 SUPER 16GB", maxDollars: 900 },
    { slug: "rtx-4070-ti-super", name: "GeForce RTX 4070 Ti SUPER 16GB", maxDollars: 650 },
    { slug: "rtx-4070-super", name: "GeForce RTX 4070 SUPER 12GB", maxDollars: 480 },
    { slug: "rtx-4060-ti", name: "GeForce RTX 4060 Ti 8GB", maxDollars: 300 },
  ]),
  brand("amd-gpu", "AMD", "graphics-card", U("photo-1555617981-dac3880eac6e", 200), GPU_IMGS, [
    { slug: "rx-7900-xtx", name: "Radeon RX 7900 XTX 24GB", maxDollars: 700 },
    { slug: "rx-7900-xt", name: "Radeon RX 7900 XT 20GB", maxDollars: 550 },
    { slug: "rx-7800-xt", name: "Radeon RX 7800 XT 16GB", maxDollars: 400 },
    { slug: "rx-7600", name: "Radeon RX 7600 8GB", maxDollars: 220 },
  ]),
  brand("evga", "EVGA", "graphics-card", U("photo-1591488320449-011701bb6704", 200), GPU_IMGS, [
    { slug: "evga-rtx-3080-ftw3", name: "EVGA FTW3 RTX 3080 10GB", maxDollars: 420 },
    { slug: "evga-rtx-3090-ftw3", name: "EVGA FTW3 RTX 3090 24GB", maxDollars: 650 },
  ]),

  // ── Monitors ──
  brand("lg", "LG", "monitor", U("photo-1527443224154-c4a3942d3acf", 200), MONITOR_IMGS, [
    { slug: "lg-ultrafine-5k", name: "LG UltraFine 5K 27\"", maxDollars: 700 },
    { slug: "lg-ultragear-27gp950", name: "LG UltraGear 27GP950", maxDollars: 450 },
    { slug: "lg-c3-oled-42", name: "LG C3 OLED 42\"", maxDollars: 800 },
  ]),
  brand("samsung-monitor", "Samsung", "monitor", U("photo-1593640408182-31c70c8268f5", 200), MONITOR_IMGS, [
    { slug: "samsung-odyssey-g9", name: "Samsung Odyssey G9", maxDollars: 700 },
    { slug: "samsung-odyssey-g7", name: "Samsung Odyssey G7", maxDollars: 400 },
    { slug: "samsung-viewfinity-s8", name: "Samsung ViewFinity S8", maxDollars: 350 },
  ]),
  brand("dell-monitor", "Dell", "monitor", U("photo-1527443224154-c4a3942d3acf", 200), MONITOR_IMGS, [
    { slug: "dell-ultrasharp-u2723qe", name: "Dell UltraSharp U2723QE", maxDollars: 400 },
    { slug: "dell-alienware-aw3423dwf", name: "Dell Alienware AW3423DWF", maxDollars: 650 },
  ]),

  // ── Drones ──
  brand("dji", "DJI", "drone", U("photo-1473968512647-3e447244af8f", 200), DRONE_IMGS, [
    { slug: "dji-mini-4-pro", name: "DJI Mini 4 Pro", maxDollars: 550 },
    { slug: "dji-air-2s", name: "DJI Air 2S", maxDollars: 400 },
    { slug: "dji-avata-2", name: "DJI Avata 2", maxDollars: 500 },
    { slug: "dji-mavic-3-pro", name: "DJI Mavic 3 Pro", maxDollars: 1400 },
    { slug: "dji-mini-se", name: "DJI Mini SE", maxDollars: 150 },
  ]),
  brand("autel", "Autel", "drone", U("photo-1508444845599-5b8999636f3f", 200), DRONE_IMGS, [
    { slug: "autel-evo-lite-plus", name: "Autel EVO Lite+", maxDollars: 700 },
    { slug: "autel-evo-nano-plus", name: "Autel EVO Nano+", maxDollars: 400 },
  ]),

  // ── Patch earlier Audio/VR with images (devices may already exist) ──
  brand("apple-audio", "Apple", "audio", U("photo-1505740420928-5e560c06d30e", 200), AUDIO_IMGS, [
    { slug: "airpods-max-2", name: "AirPods Max 2", maxDollars: 260 },
    { slug: "airpods-max", name: "AirPods Max", maxDollars: 200 },
    { slug: "airpods-pro-3", name: "AirPods Pro 3", maxDollars: 75 },
    { slug: "airpods-pro-2", name: "AirPods Pro (2nd Gen.)", maxDollars: 55 },
    { slug: "airpods-4-anc", name: "AirPods (4th Gen.) ANC", maxDollars: 50 },
    { slug: "airpods-4", name: "AirPods (4th Gen.)", maxDollars: 35 },
    { slug: "airpods-3", name: "AirPods (3rd Gen.)", maxDollars: 28 },
    { slug: "homepod-2", name: "HomePod (2nd Gen.)", maxDollars: 135 },
  ]),
  brand("bose", "Bose", "audio", U("photo-1546435770-a3e426bf472b", 200), AUDIO_IMGS, [
    { slug: "bose-qc-ultra-headphones-2", name: "Bose QuietComfort Ultra Headphones (2nd Gen)", maxDollars: 200 },
    { slug: "bose-qc-ultra-headphones", name: "Bose QuietComfort Ultra Headphones", maxDollars: 105 },
    { slug: "bose-qc-ultra-earbuds-2", name: "Bose QuietComfort Ultra Earbuds (2nd Gen)", maxDollars: 95 },
    { slug: "bose-qc-ultra-earbuds", name: "Bose QuietComfort Ultra Earbuds", maxDollars: 48 },
    { slug: "bose-ultra-open-earbuds", name: "Bose Ultra Open Earbuds", maxDollars: 55 },
    { slug: "bose-qc-headphones-2023", name: "Bose QuietComfort Headphones (2023)", maxDollars: 48 },
    { slug: "bose-soundlink-max", name: "Bose SoundLink Max Portable Speaker", maxDollars: 140 },
    { slug: "bose-portable-smart-speaker", name: "Bose Portable Smart Speaker", maxDollars: 115 },
    { slug: "bose-soundlink-home", name: "Bose SoundLink Home Bluetooth Speaker", maxDollars: 60 },
  ]),
  brand("sony-audio", "Sony", "audio", U("photo-1484704849700-f032a97bd089", 200), AUDIO_IMGS, [
    { slug: "sony-wh-1000xm6", name: "Sony WH-1000XM6", maxDollars: 185 },
    { slug: "sony-wh-1000xm5", name: "Sony WH-1000XM5", maxDollars: 95 },
    { slug: "sony-wh-1000xm4", name: "Sony WH-1000XM4", maxDollars: 70 },
    { slug: "sony-wf-1000xm5", name: "Sony WF-1000XM5", maxDollars: 85 },
    { slug: "sony-wf-1000xm4", name: "Sony WF-1000XM4", maxDollars: 55 },
  ]),
  brand("beats", "Beats", "audio", U("photo-1590658268037-6bf12165a8df", 200), AUDIO_IMGS, [
    { slug: "beats-studio-pro", name: "Beats Studio Pro", maxDollars: 120 },
    { slug: "beats-solo-4", name: "Beats Solo 4", maxDollars: 70 },
    { slug: "beats-fit-pro", name: "Beats Fit Pro", maxDollars: 55 },
    { slug: "beats-studio-buds-plus", name: "Beats Studio Buds +", maxDollars: 45 },
    { slug: "beats-powerbeats-pro-2", name: "Beats Powerbeats Pro 2", maxDollars: 90 },
  ]),
  brand("meta-vr", "Meta", "vr", U("photo-1622979135225-d2ba269cf1ac", 200), VR_IMGS, [
    { slug: "meta-quest-3s", name: "Meta Quest 3S", maxDollars: 180 },
    { slug: "meta-quest-3", name: "Meta Quest 3", maxDollars: 280 },
    { slug: "meta-quest-2", name: "Meta Quest 2", maxDollars: 90 },
    { slug: "meta-quest-pro", name: "Meta Quest Pro", maxDollars: 350 },
  ]),
  brand("apple-vr", "Apple", "vr", U("photo-1617802690992-15d93263d3a9", 200), VR_IMGS, [
    { slug: "apple-vision-pro-m5", name: "Apple Vision Pro (M5)", maxDollars: 2400 },
    { slug: "apple-vision-pro", name: "Apple Vision Pro", maxDollars: 1600 },
  ]),
  brand("valve-vr", "Valve", "vr", U("photo-1593508512255-86ab42a8e620", 200), VR_IMGS, [
    { slug: "valve-index", name: "Valve Index", maxDollars: 500 },
  ]),
  brand("sony-vr", "Sony", "vr", U("photo-1622979135225-d2ba269cf1ac", 200), VR_IMGS, [
    { slug: "playstation-vr2", name: "PlayStation VR2", maxDollars: 140 },
    { slug: "playstation-vr", name: "PlayStation VR", maxDollars: 50 },
  ]),
  brand("vive", "Vive", "vr", U("photo-1617802690992-15d93263d3a9", 200), VR_IMGS, [
    { slug: "vive-xr-elite", name: "Vive XR Elite", maxDollars: 450 },
    { slug: "vive-pro-2", name: "Vive Pro 2", maxDollars: 270 },
  ]),

  // ── Apple Watch / Samsung watch extras already partly filled ──
  brand("apple-watch", "Apple Watch", "smart-watch", U("photo-1434493789847-2f02dc6ca35d", 200), WATCH_IMGS, [
    { slug: "apple-watch-series-8-45mm", name: "Apple Watch Series 8 45mm", maxDollars: 150 },
    { slug: "apple-watch-ultra", name: "Apple Watch Ultra", maxDollars: 380 },
  ]),
];

async function getCategoryId(slug: string): Promise<number> {
  const [cat] = await db.select().from(schema.categories).where(eq(schema.categories.slug, slug)).limit(1);
  if (!cat) throw new Error(`Missing category: ${slug}`);
  return cat.id;
}

async function main() {
  console.log("Seeding IWM-parity catalog (idempotent + images)...\n");

  const stats = {
    brandsAdded: 0,
    brandsUpdated: 0,
    devicesAdded: 0,
    devicesSkipped: 0,
    imagesUpdated: 0,
    pricesWritten: 0,
    byCat: {} as Record<string, { brands: number; devices: number }>,
  };

  for (const [bi, b] of parityCatalog.entries()) {
    if (!stats.byCat[b.categorySlug]) stats.byCat[b.categorySlug] = { brands: 0, devices: 0 };
    const categoryId = await getCategoryId(b.categorySlug);

    const existingBrand = await db.select().from(schema.brands).where(eq(schema.brands.slug, b.slug)).limit(1);
    let brandId: number;

    if (existingBrand[0]) {
      brandId = existingBrand[0].id;
      if (!existingBrand[0].imageUrl) {
        await db
          .update(schema.brands)
          .set({ imageUrl: b.imageUrl, updatedAt: new Date() })
          .where(eq(schema.brands.id, brandId));
        stats.brandsUpdated++;
      }
    } else {
      const [ins] = await db
        .insert(schema.brands)
        .values({
          categoryId,
          slug: b.slug,
          name: b.name,
          imageUrl: b.imageUrl,
          sortOrder: 300 + bi,
          isActive: true,
        })
        .returning();
      brandId = ins.id;
      stats.brandsAdded++;
      stats.byCat[b.categorySlug].brands++;
      console.log(`  + brand ${b.name} (${b.slug})`);
    }

    for (const [di, d] of b.devices.entries()) {
      const imageUrl = pick(b.deviceImages, di);
      const existing = await db.select().from(schema.devices).where(eq(schema.devices.slug, d.slug)).limit(1);

      if (existing[0]) {
        stats.devicesSkipped++;
        if (!existing[0].imageUrl) {
          await db
            .update(schema.devices)
            .set({ imageUrl, updatedAt: new Date() })
            .where(eq(schema.devices.id, existing[0].id));
          stats.imagesUpdated++;
        }
        continue;
      }

      const maxQuoteCents = Math.round(d.maxDollars * 100);
      const [ins] = await db
        .insert(schema.devices)
        .values({
          brandId,
          slug: d.slug,
          name: d.name,
          imageUrl,
          maxQuoteCents,
          sortOrder: 1000 + di,
          isActive: true,
        })
        .returning();

      const priceRows = Object.entries(tiers(maxQuoteCents)).map(([conditionSlug, priceCents]) => ({
        deviceId: ins.id,
        conditionSlug,
        priceCents,
        isActive: true,
      }));
      await db.insert(schema.devicePrices).values(priceRows);
      stats.devicesAdded++;
      stats.pricesWritten += priceRows.length;
      stats.byCat[b.categorySlug].devices++;
    }
  }

  console.log("\n=== SUMMARY ===");
  console.log(`Brands added: ${stats.brandsAdded}, brand images fixed: ${stats.brandsUpdated}`);
  console.log(`Devices added: ${stats.devicesAdded}, skipped: ${stats.devicesSkipped}, images backfilled: ${stats.imagesUpdated}`);
  console.log(`Prices written: ${stats.pricesWritten}`);
  console.log("\nPer category (new this run):");
  for (const [c, s] of Object.entries(stats.byCat)) {
    console.log(`  ${c}: +${s.brands} brands, +${s.devices} devices`);
  }

  const totals = await sql.unsafe(
    `select (select count(*)::int from brands) as brands, (select count(*)::int from devices) as devices`,
  );
  console.log(`\nDB totals: ${totals[0].brands} brands, ${totals[0].devices} devices`);
  await sql.end();
}

if (process.argv.some((a) => a.includes("seed-parity-catalog"))) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
