# Task: Populate device catalog (categories → brands → models → conditions) without duplicating existing data

## Context
This app is a buyback/trade-in marketplace (ItsWorthMore/CashingTech clone). We need to expand our product catalog to match industry coverage. Categories are already added. We now need brands, device models, and condition tiers.

## Step 1 — Audit what already exists
Before adding anything, scan the current codebase/database for existing catalog data:
- Find the product/catalog data source (likely `lib/data.ts`, or the Drizzle schema tables for categories/brands/devices/prices — check `db/schema.ts` or similar).
- Build a list of every (category, brand, device model) combo that already exists.
- Print this list out for me before proceeding to Step 2, so I can confirm scope.

## Step 2 — Research reference structure
Use web search / browsing to look at how established trade-in platforms (e.g. itsworthmore.com/sell, and its per-category pages like /sell/phone, /sell/laptop, etc., and per-brand pages like /sell/iphone, /sell/macbook) structure their catalog:
- Category list
- Brand list per category
- Device model list per brand (e.g. iPhone 16 Pro Max, iPhone 16 Pro, iPhone 16, iPhone 15 Pro Max... down to older supported models)
- Condition tiers they use (typically: Flawless/Like New, Good, Fair, Broken/Damaged — check actual naming and criteria used)

Do NOT scrape or copy their images, exact copy text, or exact pricing — treat this only as a structural/naming reference. Pricing should be derived from our own market research or left as placeholder/admin-configurable, not copied verbatim from a competitor.

## Step 3 — Cross-check against Step 1 audit
For each category already in our app:
- Add only brands that are missing.
- For each brand (existing or newly added), add only device models that are missing — do not re-insert or duplicate models that already exist (match by normalized name, e.g. case-insensitive, trimmed, ignoring storage/color variants already covered).
- Flag any ambiguous near-duplicates (e.g. "iPhone 15 Pro" vs "iPhone 15 Pro Max") for my review instead of guessing.

## Step 4 — Condition tiers
For each device model, attach the standard condition tiers used in our schema (check existing enum/table — likely something like Flawless, Good, Fair, Broken). If a condition tier structure doesn't exist yet in the schema, propose one before implementing, don't invent silently.

## Step 5 — Images
Do not hotlink or scrape images from competitor sites (copyright risk). Instead:
- Check if we already have a product image pipeline/CDN (e.g. Vercel Blob, Cloudinary, S3) — use that.
- Source device images from official manufacturer press/media resources or a licensed stock/product-image API we already use in this project (check for any image-related package or API key in .env.example).
- If no image sourcing pipeline exists yet, stop and ask me before generating or fetching images — don't hardcode external hotlinked URLs into the DB as a permanent solution.

## Step 6 — Implementation
- Follow our existing schema pattern: categories → brands → devices → prices (see current Drizzle schema/migrations).
- Write a seed script (not manual UI entry) so this is re-runnable and diffable — check for existing seed file pattern first, extend it rather than creating a parallel one.
- Make the seed idempotent: re-running it should skip existing rows, not duplicate them.

## Step 7 — Report back
After running, give me a summary: how many brands added, how many device models added, per category — and list anything skipped/flagged for manual review.
