import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public", "images", "categories");

const tiles = [
  ["phone", "public/images/phones/apple-iphone-17-pro-max.jpg"],
  ["tablet", "public/images/tablets/tablet-category.jpg"],
  ["laptop", "public/images/laptops/apple-macbook-pro-16-m4.jpg"],
  ["desktop", "public/images/desktops/apple-imac-24-m4.jpg"],
  ["smart-watch", "public/images/watches/apple-watch-ultra-3.jpg"],
  ["game-console", "public/images/consoles/sony-playstation-5.jpg"],
  ["graphics-card", "public/images/gpus/nvidia-geforce-rtx-4090.jpg"],
  ["camera", "public/images/cameras/leica-m11.jpg"],
  ["audio", "public/images/audio/apple-airpods-max-2.jpg"],
  ["drone", "public/images/drones/dji-mavic-4-pro.jpg"],
  ["vr", "public/images/vr/meta-quest-3.jpg"],
  ["monitor", "public/images/monitors/apple-studio-display-27-2022.jpg"],
];

fs.mkdirSync(outDir, { recursive: true });

let totalIn = 0;
let totalOut = 0;

for (const [name, rel] of tiles) {
  const src = path.join(root, rel);
  const dest = path.join(outDir, `${name}.webp`);
  const inBytes = fs.statSync(src).size;
  totalIn += inBytes;

  await sharp(src)
    .resize(640, 640, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 72, effort: 6 })
    .toFile(dest);

  const outBytes = fs.statSync(dest).size;
  totalOut += outBytes;
  console.log(
    `${name.padEnd(16)} ${(inBytes / 1024).toFixed(0).padStart(5)} KB -> ${(outBytes / 1024).toFixed(0).padStart(3)} KB`,
  );
}

console.log(
  `\nTotal  ${(totalIn / 1024).toFixed(0)} KB -> ${(totalOut / 1024).toFixed(0)} KB  (${((totalOut / totalIn) * 100).toFixed(1)}%)`,
);
