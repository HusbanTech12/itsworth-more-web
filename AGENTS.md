# AGENTS.md — "TradeUp" (ItsWorthMore.com Rebuild)

> Premium SaaS-style rebuild of a device buyback/trade-in platform (reference: itsworthmore.com), plus a refurbished-device storefront.
> This file is the single source of truth for any coding agent (Claude Code, Cursor, etc.) working on this repo. Follow phases in order. Do not skip ahead — each phase assumes the previous one is merged and working.

---

## 1. Product Summary

A two-sided platform:

1. **Sell/Trade-in flow** — Users get an instant quote for a used device (phone, tablet, laptop, desktop, console, smartwatch, camera, drone, GPU, monitor, audio gear, VR headset), lock the quote for 21 days, ship the device free via a prepaid label, get it inspected, and get paid (ACH/PayPal/Zelle/check).
2. **Buy Refurbished storefront** — Certified pre-owned devices for sale, graded by condition, with warranty.
3. **B2B / Bulk trade-in** — Businesses submit bulk device lists for a bulk quote and IT Asset Disposition (ITAD) service.
4. **Admin/Ops console** — Staff manage incoming devices, run inspections, adjust final offers, approve payouts, manage refurb inventory.

Design direction: **Premium SaaS aesthetic** — not a coupon-site look. Think Linear / Stripe / Vercel-grade polish: generous whitespace, restrained color palette with one confident accent, large expressive type, subtle motion, glass/blur surfaces, dark-mode-first with a light mode toggle.

---

## 2. Tech Stack (Fixed — do not substitute)

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router, React Server Components, TypeScript strict) |
| Backend | Next.js Route Handlers / Server Actions (same repo, no separate service) |
| Database | Neon (serverless Postgres) |
| ORM | Drizzle ORM + drizzle-kit for migrations |
| Auth | Clerk (hosted auth, organizations for B2B accounts) |
| Styling | Tailwind CSS + shadcn/ui primitives, CSS variables for theming |
| Forms/Validation | React Hook Form + Zod |
| Payments/Payout tracking | Stripe (for refurb store checkout) — payout methods (PayPal/Zelle/Check) tracked as data, not processed in-app in MVP |
| File/Image storage | Vercel Blob or Uploadthing (device photos, condition uploads) |
| Email | Resend + React Email |
| Deployment | Vercel |
| Analytics | PostHog or Vercel Analytics |

**Package manager:** npm. **Node:** LTS. **Linting:** ESLint + Prettier + TypeScript strict mode. All agents must run `npm run lint && npm run typecheck && npm run build` before considering any phase "done."

---

## 3. Global Engineering Rules

- Server Components by default; use `"use client"` only where interactivity requires it.
- All mutations go through **Server Actions** or **Route Handlers** — never fetch DB directly from client components.
- All DB access goes through a `db/` data-access layer — no raw Drizzle calls scattered across routes/components.
- Every form is validated with a **shared Zod schema** used on both client (RHF resolver) and server (Server Action guard).
- Every route that touches user data must check the Clerk session server-side, even if middleware also checks it.
- Money is stored as **integer cents**, never floats.
- All dates in UTC in DB; format in the user's locale at render time.
- Every phase must include: migrations, seed data (if relevant), tests for critical logic (pricing calc, quote expiry, status transitions), and a short `CHANGELOG.md` entry.
- Commit style: `feat(phase-2): quote engine pricing rules`.

---

## 4. Environment Variables

```
DATABASE_URL=               # Neon connection string
DATABASE_URL_UNPOOLED=      # Neon direct (for migrations)

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

RESEND_API_KEY=
BLOB_READ_WRITE_TOKEN=

NEXT_PUBLIC_APP_URL=
```

---

## 5. Data Model (Drizzle schema — target shape)

Core tables to design in `db/schema.ts`:

- `users` — mirrors Clerk user (id = Clerk userId, role: `customer | staff | admin | business`)
- `organizations` — for B2B/bulk accounts (mirrors Clerk org)
- `device_categories` — phones, tablets, laptops, desktops, consoles, smartwatches, cameras, drones, gpus, monitors, audio, vr
- `device_models` — brand, model name, category_id, base_specs (storage/variant options as JSON)
- `condition_grades` — enum: `like_new | good | fair | broken`
- `quotes` — user_id (nullable for guest), device_model_id, selected_variant, condition_grade, quoted_price_cents, status (`active | expired | converted`), expires_at (created_at + 21 days)
- `orders` (trade-ins) — quote_id, user_id, status (`quote_locked | label_sent | shipped | received | inspecting | offer_adjusted | approved | paid | rejected | returned`), shipping_label_url, tracking_number, final_offer_cents, payout_method (`paypal | zelle | check | ach`), payout_reference, paid_at
- `order_status_history` — order_id, status, note, changed_by, created_at
- `bulk_requests` — organization_id, device_list (JSON or child table `bulk_request_items`), status, assigned_staff_id
- `refurb_products` — device_model_id, grade, price_cents, warranty_months, stock_qty, images
- `refurb_orders` — Stripe payment intent, line items, shipping address, status
- `reviews` / `testimonials` — for social proof section (rating, quote, source)
- `blog_posts` — for content/SEO
- `promotions` — e.g. "extra 5% up to $25/item, max $100" bonus rules (type, value, cap, active_from/to)

Add proper indexes on `quotes.expires_at`, `orders.status`, `refurb_products.device_model_id`.

---

## 6. Design System Requirements

### 6.1 Color Palette (exact tokens — do not let the agent improvise)

Define these as CSS variables in `globals.css` / Tailwind theme extension. Do not ship with placeholder Tailwind defaults (`slate-900`, `blue-500`, etc.) — treat this as final.

```css
/* Dark mode (default) */
--bg-base: #0A0A0C;
--bg-elevated: #101114;
--bg-surface: #16171B;
--border-subtle: #232428;
--border-strong: #34363C;

--text-primary: #F5F6F7;
--text-secondary: #A3A6AD;
--text-muted: #6B6E76;

--accent: #34D399;        /* emerald — "money/value" association, distinct from generic SaaS blue */
--accent-hover: #2BBF89;
--accent-contrast: #05130D; /* text on accent surfaces */

--success: #34D399;
--warning: #F5A623;
--danger: #F26D6D;
--info: #4EA1F5;

/* Light mode (toggle) */
--bg-base-light: #FFFFFF;
--bg-elevated-light: #F7F8F9;
--bg-surface-light: #FFFFFF;
--border-subtle-light: #E6E7EA;
--text-primary-light: #14151A;
--text-secondary-light: #5B5E66;
```

Accent is used ONLY for: primary CTAs, active/focus states, price figures, progress indicators, links inside body copy. Never use accent for large background fills — it stays a highlight color, not a wallpaper color.

### 6.2 Typography

- **Display/headline font:** `Geist` (or `General Sans` as fallback) — variable weight, used for H1–H3 and the quote widget's price display.
- **Body/UI font:** `Inter` — used for paragraphs, labels, buttons, table data.
- **Monospace:** `Geist Mono` — used only for tracking numbers, order IDs, price breakdowns in receipts.

Type scale (desktop → mobile):

| Token | Desktop | Mobile | Weight | Tracking |
|---|---|---|---|---|
| `display-xl` (hero H1) | 72px / 1.05 | 40px / 1.1 | 600 | -0.02em |
| `display-lg` (section H2) | 48px / 1.1 | 32px / 1.15 | 600 | -0.015em |
| `display-md` (card H3) | 28px / 1.2 | 22px / 1.2 | 600 | -0.01em |
| `body-lg` | 18px / 1.6 | 16px / 1.6 | 400 | 0 |
| `body-md` | 15px / 1.6 | 15px / 1.5 | 400 | 0 |
| `caption` | 13px / 1.4 | 13px / 1.4 | 500 | 0.01em |

### 6.3 Spacing & Layout

- 8px base unit. Section vertical padding: 96px desktop / 56px mobile between major page sections.
- Max content width: 1280px, with 24px side gutter on mobile, 64px on desktop.
- Card padding: 24px (default), 32px (featured/pricing cards).
- Border radius scale: `--radius-sm: 8px` (inputs, badges), `--radius-md: 12px` (cards), `--radius-lg: 20px` (modals, hero panels).

### 6.4 Surfaces & Elevation

- No heavy drop shadows anywhere. Elevation communicated via: 1px border (`--border-subtle`) + a 1–2% lighter background than the layer beneath it.
- Glass panels (nav bar on scroll, modals): `backdrop-filter: blur(16px)` over `rgba(16,17,20,0.72)`, 1px `--border-subtle` edge.
- Hover state on cards: border brightens to `--border-strong` + background lifts one step (`--bg-elevated` → `--bg-surface`), transition 150ms ease-out. No scale/shadow-pop hover effects — too "template-y."

### 6.5 Motion Spec

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` ("ease-out-expo" feel) for entrances; `ease-in-out` for toggles/tabs.
- Durations: micro (hover/focus) 120–150ms, component transitions (accordion, tab switch) 200–250ms, page-section scroll reveal 400–500ms with 60–80px translate-Y and opacity fade, staggered 60ms per sibling.
- Quote price counter: animate numerals with a rolling-digit/odometer effect (200–400ms depending on digit delta), not a plain fade.
- Respect `prefers-reduced-motion: reduce` — fall back to opacity-only, no translate, no odometer (instant value swap).
- Loading states: skeleton shimmer (not spinners) for cards/tables; a thin top-of-viewport progress bar (accent color) for route transitions.

### 6.6 Iconography & Imagery

- Icon set: **Lucide**, 1.5px stroke weight everywhere, 20px default size, 16px in dense tables, 24px in empty-states/hero.
- Device photography: consistent studio-style renders/photos on a neutral `--bg-elevated` backdrop, soft single-direction shadow — no stock-photo-with-random-background look.
- Illustrations (empty states, 404, success screens): simple line-art in accent + text-secondary only, no multi-color clipart style.

### 6.7 Component Inventory (build once in shared UI kit, reuse everywhere)

| Component | Key states/variants |
|---|---|
| Button | primary (accent fill), secondary (bordered), ghost, destructive; sm/md/lg; loading (inline spinner replaces label, width locked to prevent layout shift) |
| Input / Select / Combobox | default, focus (accent ring), error (danger ring + helper text), disabled |
| Badge | condition grade (like-new/good/fair/broken — each a distinct subtle color, not just accent everywhere) |
| StatusStepper | horizontal (desktop) / vertical (mobile) order-tracking timeline with active/complete/pending states |
| PriceTag | large odometer-style price display + strikethrough for "was" price when a promotion applies |
| Card | default, interactive (hover-lift), featured (accent border, used for pricing/plan highlight) |
| Modal / Sheet | centered modal (desktop), bottom sheet (mobile) — same component, responsive behavior |
| Toast | success/warning/danger/info, auto-dismiss 4s, swipe-to-dismiss on mobile |
| DataTable (admin) | sortable columns, sticky header, row-density toggle, empty/loading/error states |
| StatCard (admin dashboard) | value + delta indicator (up/down arrow, colored) + sparkline |
| Instant Quote Widget | the single most important component on the site — multi-step, one question per screen on mobile, live price preview panel persists on desktop as a sticky sidebar |

### 6.8 Reference Direction & Anti-Patterns

**Study (for feel, not for copying):** Stripe.com, Linear.app, Ramp.com, Vercel.com, Mercury.com — note their restraint: one accent color, lots of negative space, confident large type, understated motion.

**Explicitly avoid:**
- Generic "SaaS gradient blob" backgrounds (overused purple/pink mesh gradients).
- Default shadcn/ui look with zero customization (default radius, default gray palette) — this reads as a template, not a product.
- Coupon-site visual language: countdown timers, aggressive red badges, cluttered trust-badge rows, stock-photo hero images of people pointing at phones.
- More than one accent color competing for attention on the same screen.

### 6.9 Deliverable for This Section

Before Phase 1 UI work starts, the agent must produce a **living style guide page** (`/dev/style-guide`, dev-only route) rendering every token and component above in one place, so design decisions are visually verifiable — not just trusted from this markdown description.

---

## 7. Phase Plan

### Phase 0 — Foundations & Tooling
- Init Next.js (App Router, TS strict), Tailwind, shadcn/ui, ESLint/Prettier.
- Set up Neon project + Drizzle config (`drizzle.config.ts`), connection pooling helper (`db/index.ts`).
- Set up Clerk (sign-in/sign-up pages, middleware for protected routes, org support enabled).
- Set up base layout, theme provider (dark/light), fonts, global Tailwind tokens (colors, radii, shadows as CSS vars).
- CI: GitHub Actions running lint/typecheck/build on PR.
- Deliverable: blank but fully wired app deploys to Vercel; auth works; DB connects; `npm run db:push` works.

### Phase 1 — Marketing Site (Public Pages)
- Home page: hero with instant device-quote widget (device category → model → variant → condition → price), "as seen in" media strip, how-it-works 3-step section, trust/stats section (reviews, BBB, rating), testimonials carousel, bulk/business CTA, footer with legal links.
- Static pages: How It Works, FAQ, About, Bulk/Business Trade-In, ITAD Services, Blog index + post template, Legal pages (privacy, terms, cookie policy, accessibility, law enforcement compliance).
- Category landing pages (`/sell/[category]`) and model pages (`/sell/[category]/[model]`) — SEO-friendly, statically generated where possible (ISR).
- SEO: metadata API, sitemap.xml, robots.txt, OpenGraph images, JSON-LD for products/FAQs.
- Deliverable: fully navigable marketing site with real (seeded) copy structure, responsive, passes Lighthouse ≥ 90 on performance/SEO/accessibility.

### Phase 2 — Quote Engine
- `device_categories`, `device_models`, `condition_grades` tables + seed script with realistic sample catalog.
- Pricing rule engine: base price by model/variant × condition multiplier ± promotion adjustments, returns `quoted_price_cents`.
- Instant quote UI: multi-step selector (category → brand → model → storage/variant → condition questions) with live price preview.
- `quotes` table: persist quote (guest allowed, linked to user if signed in), 21-day expiry logic, "quote expired → re-quote at current price" flow.
- Server Actions: `createQuote`, `getQuote`, `refreshExpiredQuote`.
- Unit tests for pricing calculation and expiry logic.
- Deliverable: a user can get a real, persisted, priced quote for any seeded device without signing in.

### Phase 3 — Auth, Accounts & Order Creation
- Clerk sign-up/sign-in flows themed to match design system; post-signup redirect to dashboard.
- Convert a `quote` into an `order`: capture shipping address, generate shipping label (mock/stub integration point clearly marked `// TODO: integrate real carrier API`), order status = `quote_locked` → `label_sent`.
- Customer dashboard: list of quotes, active orders with status stepper, order detail page with tracking + timeline (`order_status_history`).
- Email notifications via Resend/React Email at each status change (quote created, label sent, device received, offer ready, paid).
- Deliverable: authenticated user can convert a quote to a trackable order and receive email updates.

### Phase 4 — Inspection, Payout & Order Lifecycle
- Staff-only inspection action: mark `received` → `inspecting` → set `final_offer_cents` (may differ from quoted price with reason) → `offer_adjusted` (customer must accept/reject) → `approved`.
- Customer flow to accept a revised offer or request device return.
- Payout recording: mark `paid`, capture `payout_method` + `payout_reference`; email receipt.
- Role-based access via Clerk (`staff`, `admin`) enforced in middleware + server actions.
- Deliverable: full order lifecycle from received device to paid customer, with revised-offer negotiation.

### Phase 5 — Admin Console
- `/admin` dashboard: KPI stat cards (orders today, avg turnaround, pending inspections, payout backlog), data tables (orders, quotes, bulk requests) with filters/search/pagination.
- Order detail admin view: edit device condition notes, upload inspection photos, adjust offer, change status, add internal notes.
- Catalog management: CRUD for `device_categories`, `device_models`, pricing rules, promotions.
- Reviews/testimonials management (approve/feature).
- Deliverable: staff can run the entire operational workflow without touching the DB directly.

### Phase 6 — Bulk / Business (B2B) Flow
- Clerk Organizations enabled; business users create an org, invite teammates.
- Bulk request form: upload CSV or add line items (`bulk_request_items`), request review, staff assigns bulk quote, generates consolidated shipping/pickup instructions.
- ITAD service inquiry form (compliance-focused, asset tags, certificate of destruction request).
- Deliverable: a business account can submit and track a bulk trade-in separate from consumer flow.

### Phase 7 — Buy Refurbished Storefront
- `refurb_products` catalog pages (grade badges: Like New/Good/Fair, warranty info, stock status), PLP + PDP.
- Cart + Stripe Checkout integration, `refurb_orders` table, Stripe webhook handling.
- Order confirmation + shipping status page for buyers.
- Cross-link: trade-in inventory that passes inspection can (conceptually) feed refurb stock — model the relationship even if the pipeline is manual in MVP.
- Deliverable: a customer can browse and buy a refurbished device end-to-end.

### Phase 8 — Trust, Content & Growth
- Testimonials/reviews aggregation display, "as seen in" press logos, live/rolling stats.
- Blog CMS-lite (MDX or DB-backed posts) for SEO content.
- Affiliate program page + referral tracking table (`referrals`) if in scope.
- Promotions engine surfaced sitewide (banner + applied automatically to quotes, e.g., "+5% bonus up to $25/item, max $100").
- Deliverable: growth/content surfaces are live and promotions apply correctly to real quotes.

### Phase 9 — Hardening & Launch
- Accessibility pass (WCAG AA): keyboard nav, focus states, contrast, screen-reader labels on the quote widget and forms.
- Performance pass: image optimization, route-level code splitting, edge caching for static marketing pages, ISR tuning.
- Security pass: rate limiting on quote/order creation, Zod validation everywhere, Clerk role checks audited, webhook signature verification (Stripe/Clerk).
- Observability: error tracking (Sentry), structured logging on server actions, uptime checks.
- Load test the quote engine and checkout flow.
- Final QA checklist + staging → production promotion.
- Deliverable: production launch.

---

## 8. Definition of Done (per phase)

A phase is complete only when:
1. `npm run lint && npm run typecheck && npm run build` pass.
2. Migrations are committed and `npm run db:push`/`npm run db:migrate` applied cleanly on a fresh Neon branch.
3. Seed data (if any) is idempotent and documented in `db/seed.ts`.
4. New routes/components follow the shared UI kit — no one-off styling that breaks the design system.
5. Critical logic (pricing, status transitions, payouts) has unit tests.
6. `CHANGELOG.md` updated with a short phase summary.
7. A short manual QA pass is documented (what was clicked through, on what viewport sizes).

---

## 9. Open Questions to Resolve Before Coding Starts

- Real carrier API for shipping labels (USPS/UPS/FedEx) — which one, or stub for MVP?
- Real payout rails (PayPal Payouts API, Zelle has no public API — likely manual/semi-manual), or fully manual for MVP?
- Whether refurb inventory is manually curated or actually sourced from completed trade-ins.
- Single-region vs multi-region (US/UK) pricing/currency from day one.
