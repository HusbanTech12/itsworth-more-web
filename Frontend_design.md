# Frontend Design System — CashingTech

New visual direction inspired by the CashingTech reference site: bold, high-contrast, editorial/tech-buyback aesthetic — replaces any previous tech-blue/zinc system. **This file covers frontend/design only.** Database schema, API routes, and business logic are defined separately in `AGENTS.md` and must not be touched based on this file.

---

## Brand Colors

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
- **Backgrounds alternate** section-to-section: `bg-cream` (default) → `bg-ink` (feature/steps/testimonial sections) → `bg-orange` (final CTA banner) — never two dark sections back-to-back without a cream section between.
- **Never** put lime text/buttons on cream — lime is reserved for use on `bg-ink` only, where it has contrast. On cream backgrounds use `bg-orange` or `bg-ink` for CTAs.
- Trust bar / logo strip sits on `bg-ink` directly under the header, full-width, with small lime-badge icons.

---

## Typography
- **Display/headline font**: a bold, tight-tracking geometric grotesk (e.g. `Founders Grotesk X-Condensed`, `General Sans Bold`, or `Clash Display` — pick one and set as `--font-display`). Headlines are set in heavy weight, large scale (`text-5xl`–`text-7xl`), tight `leading-[0.95]`, occasional mixed-case emphasis word in `text-orange` or `text-lime` (e.g. "Your old tech is worth **real cash**.")
- **Body font**: Geist Sans (keep existing), regular weight, `text-ink-muted` on cream, `text-white/80` on ink backgrounds.
- **Eyebrow labels**: small caps, bold, `text-orange` or `text-lime` (matching section bg), letter-spacing wide, e.g. "WHAT WE BUY", "WHY CASHINGTECH", "SIMPLE PROCESS".

---

## Border Radius & Shape
- `rounded-md` (6–8px) for buttons, inputs, condition pills — sharper than a pill/full-round CTA style.
- `rounded-2xl` for the main quote widget card and stat cards.
- No pill-shaped buttons; CTAs are rectangular/slightly rounded with bold uppercase label + arrow (`→`).

---

## Shadows & Depth
- Flat design, minimal shadow use. Depth communicated via **color blocking** and a signature offset border effect: dark cards on cream sit with a `4px` solid `orange` or `lime` offset border/shadow (`box-shadow: 6px 6px 0 var(--color-orange)`), not blurred drop shadows.

---

## UI Patterns

- **Header**: `bg-ink`, white/lime nav links, logo split two-tone (e.g. "Cashing" white + "Tech" orange), lime pill CTA button top-right ("Get Offer →"). Sticky, no shadow — relies on solid ink bg for separation.
- **Announcement/trust bar**: `bg-ink` strip directly under header with 4 lime-icon stat badges (rating, accreditation, payout speed, shipping) in a row.
- **Hero section**: `bg-cream`. Centered eyebrow badge (lime pill, small), giant heading with orange emphasis word, subhead in `ink-muted`, and a **dark quote widget card** (`bg-ink`, `rounded-2xl`, orange offset border) containing category/model selects and a lime-highlighted condition-pill row (selected = `bg-lime text-ink`, unselected = `bg-ink-muted/20 text-white`), full-width orange CTA button at the bottom of the card.
- **As-seen-on / trust bar**: 4-up badge row on dark bg (see above), icons in lime chip squares.
- **"3 simple steps" section**: `bg-ink`. Three stacked/grid cards, each a **different accent block color** in rotation — lime, orange, ink/white-text — each with a large ghost numeral (1/2/3) top-right, bold headline, short description. This 3-color-block rhythm is a signature pattern — reuse it anywhere a numbered step or tier list appears.
- **Category/"what we buy" grid**: `bg-ink` section, cream heading, category icon tiles in a dark grid (`bg-ink-muted/10` tiles), one tile highlighted lime as an accent (rotate which one per page/session), colored icon per category.
- **"Built for X, not Y" feature grid**: `bg-cream`, white cards with thin `border-border`, large lime numeral (`01`–`06`) top-left of each card, bold headline, muted body text. 4-up on desktop collapsing to 2-up/1-up.
- **Testimonials**: `bg-cream`, plain white cards with `border-border`, orange star rating row, quote text in `ink`, name + location in `ink-muted` small caps.
- **"Who we are" / About block**: `bg-cream`, two-column text + a row of stat chips (`bg-ink` rounded-md, lime numeral/value, small muted label) — reuse this stat-chip row pattern for any KPI display (dashboard, about, ITAD page).
- **Blog cards**: dark image/color-block header per card (rotate ink/orange/lime-tinted), location eyebrow in accent color, bold white headline overlaid, cream body card below with excerpt + "Read More →" in orange.
- **Cross-brand / dual-CTA banner**: `bg-ink` bar with lime border-top accent, showing two brand pill buttons side by side (orange-brand pill + lime-brand pill) — pattern reusable for any "two options" comparison module.
- **Final CTA section**: full-width `bg-orange` banner, large white/black headline, small subtext, `bg-ink` button with lime text — this closes the page.
- **Footer**: `bg-ink`, multi-column structure (Quick Nav, About, Legal, Newsletter, contact, social, region switcher), links in `text-white/70` hover `text-lime`.

---

## Condition Selector (Key UX)
- Horizontal pill/segmented row (not vertical radio list).
- Each pill: icon + label (e.g. "⚡ Flawless", "👍 Good", "🙂 Fair", "✖ Broken").
- Selected state: `bg-lime text-ink font-bold`. Unselected: `bg-white/10 text-white` (on dark widget) or `bg-ink-muted/10 text-ink` (on light widget context, e.g. device detail page).
- Price updates live beside/below the selector.

---

## Device Grid
- Cards: `bg-white border border-border rounded-2xl`.
- Price line: `"Cash in up to "` in `ink-muted` + amount in bold `text-orange`.

---

## Buttons & Forms
- Primary submit buttons: `bg-orange text-white` (on cream contexts) or `bg-lime text-ink` (on ink contexts).
- Secondary buttons: `bg-ink text-white`.
- Inputs: `rounded-md`, `border-border`.

---

## Shared UI Component Notes

- `Button.tsx` — variants: primary (orange-on-cream / lime-on-ink), secondary (ink), outline, ghost, danger, sizes: sm, md, lg — `rounded-md`, uppercase bold label option.
- `Input.tsx` — `rounded-md`, `border-border`.
- `Badge.tsx` — add lime/orange "accent" variant.
- `Card.tsx` — add `offset` prop for signature offset-border card style.
- `StarRating.tsx` — orange stars.
- `StatChip.tsx` **(new)** — dark rounded-md chip with big value + muted label (About/dashboard stat rows).
- `SectionEyebrow.tsx` **(new)** — small caps colored label used above every section heading.
- `Header.tsx` — ink bg, two-tone logo, lime CTA pill.
- `Footer.tsx` — ink bg, multi-column.
- `AnnouncementBar.tsx` — renders the 4-badge lime trust strip on ink bg.
- `HeroSection.tsx` — cream bg, dark quote widget card, orange emphasis heading.
- `CategoryGrid.tsx` — dark grid section, category tiles.
- `HowItWorks.tsx` — 3-color-block step section.
- `WhyChooseUs.tsx` — numbered feature grid (01–06) on cream.
- `TestimonialCarousel.tsx` — cream/white cards.
- `CTASection.tsx` — orange full-width closing banner.
- `DeviceCard.tsx` — white/border-border, orange price.
- `ConditionSelector.tsx` — horizontal pill row, lime selected state.

---

## Frontend Design Update — Build Order

1. **Tokens**: Add new color tokens (`ink`, `cream`, `lime`, `orange`, `ink-muted`, `border`) to `globals.css` `@theme` block — do not remove old tokens if still referenced elsewhere; migrate usages incrementally.
2. **Typography**: Set/confirm display font for headings; verify Geist Sans still used for body.
3. **Core UI primitives**: Restyle `Button`, `Input`, `Card` (+ offset-border variant), `Badge` to new tokens first — everything else inherits from these.
4. **Header/Footer/AnnouncementBar**: Switch to ink bg, two-tone logo, lime CTA, 4-badge trust strip.
5. **Hero**: Rebuild hero on cream bg with dark quote widget card, orange emphasis word, pill-style `ConditionSelector`.
6. **Section-by-section restyle** in page order: HowItWorks (3-color-block) → CategoryGrid (dark) → WhyChooseUs (numbered grid) → TestimonialCarousel → About/stat chips → Blog cards → dual-brand banner → final CTA banner.
7. **Sell flow pages**: Apply new `DeviceCard`, `ConditionSelector`, `QuoteDisplay` styling across `/sell/*` routes.
8. **Box/Checkout/Dashboard**: Restyle inputs/buttons/cards to new tokens only — no logic changes.
9. **QA pass**: Confirm lime is never used on cream backgrounds, section bg rhythm (cream → ink → cream → orange) is consistent, and all interactive states (hover/focus/selected) map to the new palette.

---

> ⚠️ No backend changes: this file must not affect database schema, Drizzle models, API route logic, or business logic defined in `AGENTS.md`.