import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..", "public", "images");
const skipDirs = new Set(["categories"]);

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (!skipDirs.has(ent.name)) walk(p, acc);
    } else if (/\.jpe?g$/i.test(ent.name)) {
      acc.push(p);
    }
  }
  return acc;
}

const files = walk(root);
let inBytes = 0;
let outBytes = 0;
let done = 0;
let cursor = 0;
const concurrency = 4;

async function worker() {
  while (cursor < files.length) {
    const file = files[cursor++];
    inBytes += fs.statSync(file).size;
    const dest = file.replace(/\.jpe?g$/i, ".webp");
    await sharp(file)
      .rotate()
      .resize(640, 640, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 72, effort: 4 })
      .toFile(dest);
    outBytes += fs.statSync(dest).size;
    done += 1;
    if (done % 40 === 0 || done === files.length) {
      console.log(`${done}/${files.length}`);
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
console.log(
  `\n${files.length} images  ${(inBytes / 1024 / 1024).toFixed(0)} MB JPG -> ${(outBytes / 1024 / 1024).toFixed(1)} MB WebP`,
);
