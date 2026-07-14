# Frontend Design System — CashingTech

New visual direction inspired by the CashingTech reference site: bold, high-contrast, editorial/tech-buyback aesthetic — replaces any previous tech-blue/zinc system. **This file covers frontend/design only.** Database schema, API routes, and business logic are defined separately in `AGENTS.md` and must not be touched based on this file.

---

## 1. Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-ink` | `#111111` | Primary dark surface — header, footer, dark section backgrounds, body copy on light bg |
| `--color-cream` | `#EFEBE2` | Primary light/page background (warm off-white, not pure white) |
| `--color-lime` | `#C6F135` | Primary accent — CTAs on dark bg, active states, badges, highlight numerals |
| `--color-orange` | `#F0532D` | Secondary accent — key headline word highlight, dark-bg CTA buttons, hero card border/glow |
| `--color-white` | `#FFFFFF` | Cards on dark backgrounds, text on ink/orange |
| `--color-ink-muted` | `#4A4A46` | Secondary/body text on cream background |
| `--color-border` | `#E3DED2` | Card borders, dividers on cream sections |

Tailwind v4 `@theme` tokens (add to `globals.css`, do not remove existing tokens used elsewhere — extend only):

```css
@theme {
  --color-ink: #111111;
  --color-cream: #EFEBE2;
  --color-lime: #C6F135;
  --color-orange: #F0532D;
  --color-ink-muted: #4A4A46;
  --color-border: #E3DED2;
}
```

### Rules
- **Backgrounds alternate** section-to-section: `bg-cream` (default) → `bg-ink` (feature/steps/testimonial sections) → `bg-orange` (final CTA banner) — never two dark sections back-to-back without a cream section between, except the trust bar which sits directly under the ink header (ink-on-ink is fine only for header→trust bar).
- **Never** put lime text/buttons directly on cream — lime is reserved for use on `bg-ink` backgrounds, or on a white card that itself sits inside a cream section. On cream backgrounds use `bg-orange` or `bg-ink` for CTAs/numerals.
- Orange is the only accent allowed directly on cream backgrounds (numerals, CTA buttons, links, price highlights, star ratings).

---

## 2. Typography
- **Display/headline font**: bold, tight-tracking geometric grotesk (e.g. `Founders Grotesk X-Condensed`, `General Sans Bold`, or `Clash Display` — pick one, set as `--font-display`). Headlines heavy weight, tight `leading-[0.95]`, mixed-case emphasis words in `text-orange`.
- **Body font**: Geist Sans (keep existing), regular weight, `text-ink-muted` on cream, `text-white/80` on ink backgrounds.
- **Eyebrow labels**: small caps, bold, uppercase, letter-spacing wide (`tracking-wider`), colored to match context — `text-orange` on cream sections, `text-lime` on ink sections.

---

## 3. Border Radius, Shape & Shadows
- `rounded-md` (6–8px) for buttons, inputs, condition pills, tiles, stat chips.
- `rounded-2xl` for the hero quote widget card and large feature cards.
- No pill-shaped buttons — CTAs are rectangular/slightly rounded, bold uppercase label + arrow (`→`).
- Flat design, minimal blur shadows. Depth via color blocking + signature **offset border**: `box-shadow: 6px 6px 0 var(--color-orange)` (or lime, matching context) on the hero card and other featured cards — not blurred drop shadows.

---

## 4. Section-by-Section Specs

### 4.1 Header (Global)
- `bg-ink`, sticky, no shadow (relies on solid ink bg for separation from cream page content below).
- Left: two-tone logo — first word `text-white font-bold`, second word `text-orange font-bold` (e.g. "Cashing" + "Tech" pattern — apply same two-tone treatment to the actual site logo/wordmark).
- Center/right nav links: `text-white/80 text-sm font-medium`, hover `text-lime`. Items: How It Works, Devices/Sell, About, Blog.
- Far right: CTA pill button, `bg-lime text-ink font-bold text-sm`, `rounded-md`, `px-4 py-2` — "Get Offer →".
- Mobile: hamburger menu replaces nav links, logo + CTA remain visible.

### 4.2 Hero Section
> Full spec already delivered separately in `hero-section-prompt.md` — implement exactly as written there. Summary: `bg-cream`, lime eyebrow badge, 3-line bold headline with orange emphasis on "real" and "cash.", muted subhead, centered dark (`bg-ink`) quote widget card with offset orange border containing category/model selects, storage/carrier selects, lime-labeled condition pill row (Flawless/Good/Fair/Broken), full-width orange CTA button, and light microcopy line underneath.

### 4.3 Trust Bar (directly under header)
- Full-width strip, `bg-ink`, sits immediately below the header (no gap), `py-6`.
- 4-column row (`grid grid-cols-2 md:grid-cols-4`), each column:
  - Small square icon chip, `bg-lime`, `rounded-md`, icon inside in `text-ink`
  - Bold white headline text next to/below icon (e.g. "4.8 / 5 Stars", "BBB Accredited", "Paid in 24 Hrs", "Free Shipping")
  - Small muted subtext below headline (`text-white/50 text-xs`) (e.g. "2,400+ reviews", "Trusted & verified", "After inspection", "Prepaid & tracked")
- Items are left-aligned within each column, icon + text side by side horizontally.

### 4.4 "3 Simple Steps" Section
- `bg-ink`, `py-24`.
- Eyebrow: "SIMPLE PROCESS" in `text-orange` (small caps).
- Heading: "3 simple steps to get paid" — large bold white, `leading-tight`, left-aligned within a constrained content width (not centered — matches reference).
- Below heading: **3 stacked full-width cards** (single column, not a row), each `rounded-2xl`, generous padding (`p-8`), in this rotating color order:
  1. **Card 1 — `bg-lime`**: small checkmark icon top-left (`text-ink`), large ghost numeral "1" top-right (`text-ink/20`, huge, bold, low-opacity outline style), bold headline "No-haggle, instant offer" (`text-ink`), description text below in `text-ink/70`: "Pick your device and condition — no account needed. Boom, your offer is live in seconds."
  2. **Card 2 — `bg-orange`**: small box/package emoji or icon top-left, ghost numeral "2" top-right (`text-white/20`), bold white headline "Free pickup shipping", description in `text-white/80`: "Accept your offer and we email a free prepaid label. Box it, drop it off — we handle the rest."
  3. **Card 3 — `bg-ink border border-white/10`** (distinct from section bg via a subtle border or a slightly lighter ink shade, e.g. `bg-[#1a1a1a]`): money-bag emoji/icon top-left, ghost numeral "3" top-right (`text-white/10`), bold white headline "No-hoops, fast payment", description in `text-white/70`: "We inspect, confirm, and pay you within 24 hours — your way. PayPal, Zelle, Venmo, or check."
- Each card's numeral is oversized (`text-6xl` or larger), positioned absolute/top-right, decorative and low-contrast against its own card background.

### 4.5 "What We Buy" Category Grid
- `bg-ink`, `py-24`, centered content.
- Eyebrow: "WHAT WE BUY" in `text-lime`, centered.
- Heading: "We take it all — new, old, even broken" — large bold white, centered, `leading-tight`.
- Below: **responsive tile grid** (`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3`), one tile per category:
  - Phone, Tablet, Laptop, Desktop, Smartwatch, Game Console, Graphics Card, Camera, Audio, Drone, VR Headset, Monitor, Smart Glasses
  - Each tile: `bg-[#1c1c1c]` (slightly lighter than pure ink) or `bg-white/5`, `rounded-md`, `aspect-square`, flex column centered content
  - Icon (colored per category — vary icon colors: pink, teal, purple, orange, blue etc. as accents, each icon in its own bright color per the reference) centered, `text-2xl` or an actual icon component
  - Label below icon, `text-white text-xs font-medium`, centered
  - **One tile highlighted**: `bg-lime` background with `text-ink` label instead of white text (rotate which category is highlighted, or make it dynamic/seasonal — default to "Graphics Card" or the current promo category)
- Grid should wrap gracefully; last row can be shorter (not forced to fill).

### 4.6 "Built for Sellers, Not Buyers" Feature Grid
- `bg-cream`, `py-24`.
- Eyebrow: "WHY CASHINGTECH" in `text-orange`.
- Heading: "Built for sellers, not buyers" — large bold `text-ink`, `leading-tight`.
- Below: **6-card grid** (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`, with the layout wrapping to 4-up then 2-up on last row as in reference — first 4 in one row, last 2 in a second row):
  - Each card: `bg-white border border-border rounded-2xl p-6`
  - Large bold numeral top-left: `01`–`06` in `text-lime` (bold, large, `text-3xl`+) — **note**: numerals use lime here even though it's a cream section background, because they sit on a *white card*, not directly on cream — this is the one permitted exception to the "no lime on cream" rule (white card counts as neutral, not cream)
  - Bold headline below numeral, `text-ink`, e.g. "Instant Offers", "21-Day Price Lock", "Your Payment, Your Way", "We Beat Trade-Ins", "Even Broken Devices", "Full Transparency"
  - Muted description below headline, `text-ink-muted text-sm`
  - Six items total: (01) Instant Offers, (02) 21-Day Price Lock, (03) Your Payment, Your Way, (04) We Beat Trade-Ins, (05) Even Broken Devices, (06) Full Transparency — use exact copy from existing brand content, matching this structure.

### 4.7 Testimonials
- `bg-cream`, `py-24`.
- Eyebrow: "REAL PEOPLE, REAL CASH" in `text-orange`.
- Heading: "Don't just take our word for it" — large bold `text-ink`.
- Below: **3-column card row** (`grid grid-cols-1 md:grid-cols-3 gap-4`, becomes a carousel/slider on mobile if more than 3 testimonials exist — use existing `TestimonialCarousel` component logic, just restyle):
  - Each card: `bg-white border border-border rounded-2xl p-6`
  - Star rating row top: 5 stars, filled stars in `text-orange`, unfilled in `text-border` (support partial ratings e.g. 4.5 shown as 4 full + 1 half/outline)
  - Quote text: `text-ink text-base`, in quotes, 2–3 sentences
  - Name + location below, small caps or bold: `text-ink font-semibold text-sm` for name, `text-ink-muted text-sm` for location (e.g. "Marcus T. · Dallas, TX")

### 4.8 "Who We Are" / About Section
- `bg-cream`, `py-24`.
- Eyebrow: "WHO WE ARE" in `text-orange`.
- Heading: "Built by people who know tech. Trusted by thousands across [region]." — large bold `text-ink`, can wrap 2 lines.
- Below heading: **two-column body text** (`grid grid-cols-1 md:grid-cols-2 gap-8`), each column 2–3 paragraphs, `text-ink-muted text-sm leading-relaxed`, covering: company origin/mission, sustainability angle (refurbished/recycled), sister-brand relationship (if applicable), service area coverage, pricing engine trust statement.
- Below the text columns: **stat chip row** (`grid grid-cols-2 md:grid-cols-5 gap-3` — the reference shows 4 in a row + 1 wrapping, adjust to fit however many stats exist):
  - Each chip: `bg-ink rounded-md p-4`, large bold value in `text-lime` (e.g. "$2M+", "10K+", "4.8★", "24hr", "BBB"), small muted label below in `text-white/60 text-xs` (e.g. "Paid out to sellers", "Devices purchased", "Average star rating", "Payment after inspection", "Accredited business").

### 4.9 Blog Section
- `bg-cream`, `py-24`.
- Eyebrow: location/category-style label in `text-orange` (e.g. "[REGION] TECH TIPS & LOCAL GUIDES").
- Heading: "The [Brand] Blog" — large bold `text-ink`.
- Subhead below: `text-ink-muted`, one line, e.g. "Tips, local guides, and everything you need to know about selling your tech in [region]."
- Below: **3-column card grid** (`grid grid-cols-1 md:grid-cols-3 gap-6`), each blog card:
  - **Top block**: colored header block, `rounded-t-2xl`, `aspect-[4/3]` or similar, rotating background per card (`bg-ink`, `bg-orange`, or an ink-tinted photo placeholder), containing:
    - Small caps location/category eyebrow at top, colored to contrast the block (`text-lime` on ink block, `text-white` on orange block)
    - Bold white headline overlaid lower in the block, `text-xl leading-tight`
  - **Bottom block**: `bg-white rounded-b-2xl border border-border border-t-0 p-5`:
    - Excerpt text, `text-ink-muted text-sm`, 2–3 lines, truncated
    - "Read More →" link, `text-orange font-semibold text-sm`, bottom
  - Grid supports pagination/"load more" for additional posts beyond the first 6.

### 4.10 Dual-Brand / Cross-Promo Banner
> Only applicable if the project has a sister-brand relationship to reference (per `AGENTS.md` business context); otherwise omit this section or repurpose it as a generic "two options" comparison banner.
- `bg-ink`, `rounded-2xl`, `mx-auto max-w-6xl`, thin `border-t-4 border-lime` accent on top edge, `p-8`, flex row (stacks on mobile) with content left, buttons right.
- Left: bold white heading with one word in `text-lime` (e.g. "Two brands. **One mission.** Get you paid."), small muted subtext below (`text-white/50 text-sm`).
- Right: two pill buttons side by side — one `bg-orange text-white`, one `bg-lime text-ink`, each showing a small brand mark + short label (e.g. icon + "We Buy Your Car" / icon + "We Buy Your Tech").

### 4.11 Final CTA Banner
- Full-width, `bg-orange`, `py-20`, centered content, `rounded-2xl` if inset with page margin (or edge-to-edge — match existing section container pattern).
- Large bold heading, `text-white`, centered, 1–2 lines: "Your device is making someone money. Make it yours."
- Small subtext below, `text-white/80 text-sm`, centered: "Get your instant offer now. 60 seconds. No account. No obligation."
- CTA button below, `bg-ink text-lime font-bold`, `rounded-md`, `px-8 py-4`, uppercase: "GET MY INSTANT OFFER →"

### 4.12 Footer (Global)
- `bg-ink`, `py-16`, multi-column layout (`grid grid-cols-2 md:grid-cols-5 gap-8`):
  - Logo + short tagline + social icons (row of small circular icon buttons, `bg-white/10` hover `bg-lime`)
  - Quick Nav column
  - About Us column
  - Legal column (Privacy, Terms, Cookie Policy, User Agreement, Law Enforcement, Accessibility)
  - Newsletter signup column: email input (`bg-white/5 border border-white/10 rounded-md`) + orange submit button
- Bottom bar below columns: `border-t border-white/10 pt-6`, flex row (stacks mobile) with copyright text left (`text-white/40 text-xs`) and region/language switcher right (US/UK style pill toggle, `bg-white/10 rounded-md`).
- All footer links: `text-white/60 text-sm`, hover `text-lime`.

---

## 5. Condition Selector (Key UX Component)
- Horizontal pill/segmented row (not vertical radio list) — used in hero widget and on device detail pages.
- Each pill: icon + label (e.g. "⚡ Flawless", "👍 Good", "🙂 Fair", "✖ Broken").
- Selected state: `bg-lime text-ink font-bold`. Unselected: `bg-white/10 text-white` (on dark widget) or `bg-ink-muted/10 text-ink` (on light widget context, e.g. device detail page).
- Price updates live beside/below the selector — keep existing state logic, only restyle.
- Keyboard-navigable (`role="radiogroup"` / `role="radio"` or native radio inputs styled as pills), visible focus ring: `focus-visible:ring-2 ring-lime`.

---

## 6. Device Grid
- Cards: `bg-white border border-border rounded-2xl`, device image, name, price line.
- Price line: `"Cash in up to "` in `text-ink-muted` + amount in bold `text-orange`.
- Responsive grid: 2 cols mobile → 4 cols desktop (existing behavior, restyle only).

---

## 7. Box/Cart, Checkout, Dashboard
- No structural/logic change. Restyle inputs/buttons/cards to the new tokens: `rounded-md` inputs with `border-border`, primary submit buttons `bg-orange text-white` (on cream contexts) or `bg-lime text-ink` (on ink contexts), secondary buttons `bg-ink text-white`.
- Order status timeline: use `bg-lime` for completed steps, `bg-orange` for current step, `bg-border` for upcoming steps.

---

## 8. Shared UI Component Notes

- `Button.tsx` — variants: primary (orange-on-cream / lime-on-ink), secondary (ink), outline, ghost, danger, sizes: sm, md, lg — `rounded-md`, uppercase bold label option.
- `Input.tsx` / `Select.tsx` / `Textarea.tsx` — `rounded-md`, `border-border`.
- `Badge.tsx` — add lime/orange "accent" variant.
- `Card.tsx` — add `offset` prop for signature offset-border card style.
- `StarRating.tsx` — orange filled stars, border-colored unfilled stars.
- `StatChip.tsx` **(new)** — dark rounded-md chip with big lime value + muted label (About/dashboard stat rows).
- `SectionEyebrow.tsx` **(new)** — small caps colored label used above every section heading, prop for `tone: 'orange' | 'lime'` depending on section background.
- `CategoryTile.tsx` **(new)** — dark grid tile with icon + label, optional `highlighted` prop for the lime variant.
- `StepCard.tsx` **(new)** — full-width colored card with ghost numeral, used in the "3 Simple Steps" section, prop for `variant: 'lime' | 'orange' | 'ink'`.
- `Header.tsx` — ink bg, two-tone logo, lime CTA pill.
- `Footer.tsx` — ink bg, 5-column layout, newsletter form, region switcher.
- `AnnouncementBar.tsx` — repurposed to render the 4-badge lime-icon trust strip on ink bg, directly under header.
- `HeroSection.tsx` — cream bg, dark quote widget card, orange emphasis heading (see `hero-section-prompt.md`).
- `CategoryGrid.tsx` — dark grid section, category tiles, one lime-highlighted.
- `HowItWorks.tsx` — 3-color-block full-width stacked step cards.
- `WhyChooseUs.tsx` — numbered (01–06) feature grid on cream, white cards.
- `TestimonialCarousel.tsx` — cream/white cards, orange stars.
- `AboutStats.tsx` **(new)** — two-column text + stat chip row.
- `BlogCardGrid.tsx` — colored header block cards + cream body.
- `CrossBrandBanner.tsx` **(new, optional)** — dual-brand promo bar.
- `CTASection.tsx` — orange full-width closing banner.
- `DeviceCard.tsx` — white/border-border, orange price.
- `ConditionSelector.tsx` — horizontal pill row, lime selected state.

---

## 9. Frontend Design Update — Build Order

1. **Tokens**: Add new color tokens (`ink`, `cream`, `lime`, `orange`, `ink-muted`, `border`) to `globals.css` `@theme` block — do not remove old tokens if still referenced elsewhere; migrate usages incrementally.
2. **Typography**: Set/confirm display font for headings; verify Geist Sans still used for body.
3. **Core UI primitives**: Restyle `Button`, `Input`, `Select`, `Card` (+ offset-border variant), `Badge`, `StarRating` to new tokens first — everything else inherits from these.
4. **Header + Trust Bar + Footer**: Global chrome first — ink bg header with two-tone logo and lime CTA, trust bar strip directly beneath, 5-column footer with newsletter + region switcher.
5. **Hero**: Build per `hero-section-prompt.md` — cream bg, dark quote widget card, condition pills, orange CTA.
6. **Section-by-section restyle** in page order: HowItWorks (3-color-block cards) → CategoryGrid (dark tile grid) → WhyChooseUs (numbered white-card grid) → TestimonialCarousel → AboutStats (two-column + stat chips) → BlogCardGrid → CrossBrandBanner (if applicable) → final CTASection.
7. **Sell flow pages**: Apply new `DeviceCard`, `ConditionSelector`, `QuoteDisplay` styling across `/sell/*` routes — reuse existing data-fetching logic, restyle only.
8. **Box/Checkout/Dashboard**: Restyle inputs/buttons/cards/timeline to new tokens only — no logic changes.
9. **QA pass**: Confirm lime is never used directly on cream backgrounds (only on ink backgrounds or on white cards sitting within a cream section), section bg rhythm (cream → ink → cream → orange) is consistent, all interactive states (hover/focus/selected) map to the new palette, and all copy/section content matches the brand's actual business details (not placeholder CashingTech copy) before shipping.

---

> ⚠️ No backend changes: this file must not affect database schema, Drizzle models, API route logic, or business logic defined in `AGENTS.md`.
