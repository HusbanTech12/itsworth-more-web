# CashingTech — Fullstack SaaS Platform

## Project Overview

Electronics trade-in marketplace — users sell used phones, tablets, laptops, and other electronics for cash. The platform provides instant quotes, free shipping, fast payments, bulk/ITAD programs, affiliate commissions, and a full account portal.

Primary audience: US/UK consumers + B2B (bulk/ITAD).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16.2 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database | Neon (Postgres) |
| ORM | Drizzle ORM |
| Auth | Clerk |
| Linting | ESLint 9 |

---

## Routes & Page Structure

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, selling steps, testimonials, trust badges, CTA |
| `/sell` | Category grid + search (gateway to device selection) |
| `/sell/[category]` | Brand list within category (e.g. `/sell/phone`, `/sell/tablet`) |
| `/sell/[category]/[brand]` | Device model list (e.g. `/sell/phone/iphone`) |
| `/sell/[category]/[brand]/[device]` | Device detail — condition selector, instant quote, add-to-box |
| `/bulk-trade-in` | Bulk buyback program landing + quote request form (20+ devices) |
| `/itad` | IT Asset Disposition — enterprise asset recovery landing + contact form |
| `/support` | FAQ accordion + contact form |
| `/become-an-affiliate` | Affiliate program info + ShareASale signup link |
| `/about` | Company info |
| `/custom-quote` | Custom quote request form |
| `/blog` | Blog listing/blog posts |
| `/coupon/[code]` | Coupon/promo code application |

### Auth Pages (Clerk-managed)
| Route | Description |
|-------|-------------|
| `/sign-in` | Sign in |
| `/sign-up` | Sign up |
| `/account` | Account settings, 2FA, password, social links |

### App Pages (Authenticated)
| Route | Description |
|-------|-------------|
| `/sell/box` | Shopping cart ("My Box") — items, totals |
| `/sell/box/checkout` | Checkout — shipping method, payment method, coupon, submit order |
| `/dashboard` | User dashboard — order history, referral commissions, tracking |
| `/dashboard/orders/[id]` | Order detail — status timeline, offer details, reinspection request |
| `/api/*` | All API routes (see below) |

### Legal Pages
| Route | Description |
|-------|-------------|
| `/privacy-policy` | Privacy policy |
| `/terms-and-conditions` | Terms & conditions |
| `/cookie-policy` | Cookie policy |
| `/user-agreement` | User agreement |
| `/law-enforcement` | Law enforcement compliance |
| `/accessibility` | Accessibility statement |

---

## Database Schema (Drizzle + Neon)

### `categories`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| slug | varchar(100) unique | e.g. `phone`, `tablet`, `laptop` |
| name | varchar(100) | e.g. "Mobile Phones" |
| icon | text | SVG or icon class |
| sort_order | integer | |
| is_active | boolean | |
| meta_title | text | SEO |
| meta_description | text | SEO |
| created_at | timestamp | |
| updated_at | timestamp | |

### `brands`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| category_id | integer FK → categories | |
| slug | varchar(100) unique | e.g. `iphone`, `samsung` |
| name | varchar(100) | e.g. "iPhone", "Samsung" |
| image_url | text | Brand logo |
| sort_order | integer | |
| is_active | boolean | |
| meta_title | text | SEO |
| meta_description | text | SEO |
| created_at | timestamp | |
| updated_at | timestamp | |

### `devices`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| brand_id | integer FK → brands | |
| slug | varchar(100) unique | e.g. `iphone-16-pro-max` |
| name | varchar(200) | e.g. "iPhone 16 Pro Max" |
| image_url | text | Device photo |
| max_quote_cents | integer | Max cash-up-to amount in cents |
| sort_order | integer | |
| is_active | boolean | |
| meta_title | text | SEO |
| meta_description | text | SEO |
| created_at | timestamp | |
| updated_at | timestamp | |

### `device_prices`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| device_id | integer FK → devices | |
| condition_slug | varchar(50) | e.g. `brand-new`, `flawless`, `good`, `fair`, `broken` |
| price_cents | integer | Offer price in cents |
| is_active | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

### `device_conditions`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| slug | varchar(50) unique | e.g. `brand-new`, `flawless`, `good`, `fair`, `broken`, `very-good` |
| label | varchar(100) | e.g. "Brand New", "Flawless" |
| description | text | Condition description |
| is_bulk | boolean | Available for bulk forms |
| is_retail | boolean | Available for retail flow |
| sort_order | integer | |
| created_at | timestamp | |

### `coupons`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| code | varchar(50) unique | e.g. `468XOR38` |
| type | varchar(20) | `percentage` or `fixed` |
| value_cents | integer | For fixed discounts |
| percentage | decimal(5,2) | For percentage discounts |
| max_apply_cents | integer | Max discount per item |
| max_apply_total_cents | integer | Max discount per order |
| min_order_cents | integer | Min order to apply |
| max_uses | integer | Global usage cap |
| max_uses_per_user | integer | Per-user cap |
| is_active | boolean | |
| starts_at | timestamp | |
| expires_at | timestamp | |
| created_at | timestamp | |

### `orders`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| user_id | text (Clerk user ID) | |
| offer_number | varchar(20) unique | e.g. `IWM-XXXXX` |
| status | varchar(30) | `quote_pending`, `quote_accepted`, `device_shipped`, `device_received`, `inspecting`, `offer_revised`, `offer_accepted`, `offer_declined`, `payment_sent`, `completed`, `cancelled`, `return_shipped` |
| subtotal_cents | integer | Sum of item prices |
| coupon_id | integer FK → coupons | |
| coupon_discount_cents | integer | |
| total_cents | integer | Final total |
| payment_method | varchar(20) | `check`, `paypal`, `zelle`, `ach`, `wire` |
| payment_email | text | For PayPal/Zelle |
| payment_status | varchar(20) | `pending`, `processing`, `sent`, `completed` |
| shipping_method | varchar(20) | `standard`, `expedited` |
| shipping_label_url | text | Generated label |
| tracking_number | varchar(100) | |
| carrier | varchar(20) | `fedex`, `ups` |
| expires_at | timestamp | 21-day quote validity |
| submitted_at | timestamp | |
| device_received_at | timestamp | |
| inspected_at | timestamp | |
| paid_at | timestamp | |
| cancelled_at | timestamp | |
| notes | text | Internal notes |
| created_at | timestamp | |
| updated_at | timestamp | |

### `order_items`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| order_id | integer FK → orders | |
| device_id | integer FK → devices | |
| device_name | varchar(200) | Snapshot at time of order |
| condition_slug | varchar(50) | Snapshot |
| condition_label | varchar(100) | Snapshot |
| offered_price_cents | integer | Quote at time of order |
| final_price_cents | integer | After inspection adjustment |
| has_accessories | boolean | |
| imei | varchar(50) | |
| serial_number | varchar(100) | |
| created_at | timestamp | |

### `order_timeline`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| order_id | integer FK → orders | |
| event | varchar(50) | e.g. `quote_created`, `device_shipped`, `device_received`, `payment_sent` |
| description | text | Human-readable |
| metadata | jsonb | Extra data |
| created_at | timestamp | |

### `order_reinspections`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| order_id | integer FK → orders | |
| reason | text | |
| status | varchar(20) | `requested`, `in_progress`, `completed` |
| result | text | |
| created_at | timestamp | |

### `addresses`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| user_id | text (Clerk user ID) | |
| type | varchar(10) | `shipping` or `billing` |
| name | varchar(200) | |
| street | text | |
| street2 | text | |
| city | varchar(100) | |
| state | varchar(100) | |
| zip | varchar(20) | |
| country | varchar(10) | `US` or `UK` |
| phone | varchar(20) | |
| is_default | boolean | |
| created_at | timestamp | |

### `affiliate_commissions`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| user_id | text (Clerk user ID) | |
| order_id | integer FK → orders | |
| amount_cents | integer | |
| status | varchar(20) | `pending`, `paid`, `cancelled` |
| referral_code | varchar(50) | |
| created_at | timestamp | |

### `newsletter_subscriptions`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| email | varchar(255) unique | |
| locale | varchar(10) | `en` or `en-GB` |
| is_active | boolean | |
| created_at | timestamp | |

### `bulk_quote_requests`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| name | varchar(200) | |
| company_name | varchar(200) | |
| email | varchar(255) | |
| phone | varchar(20) | |
| specs_file_url | text | |
| comments | text | |
| type | varchar(20) | `bulk` or `itad` |
| status | varchar(20) | `new`, `contacted`, `quoted`, `closed` |
| created_at | timestamp | |

### `bulk_quote_items`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| request_id | integer FK → bulk_quote_requests | |
| product_name | varchar(200) | |
| quantity | integer | |
| condition_slug | varchar(50) | |
| category | varchar(50) | |
| specs | text | |
| created_at | timestamp | |

### `contact_messages`
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| name | varchar(200) | |
| email | varchar(255) | |
| subject | varchar(200) | |
| message | text | |
| is_read | boolean | |
| created_at | timestamp | |

---

## Design System

### Brand
- **Primary**: A vibrant accent color (#0a84ff or similar tech-blue) vs warm accent
- **Neutrals**: zinc/gray scale (Tailwind `zinc-50` through `zinc-900`)
- **Backgrounds**: `bg-white` body, `bg-zinc-50` for sections
- **Typography**: Geist Sans (body), Geist Mono (code/stats)
- **Border radius**: `rounded-lg` (8px) for cards, `rounded-full` for CTAs
- **Shadows**: Subtle `shadow-sm` on cards, `shadow-lg` on modals

### UI Patterns
- **Header**: Sticky top bar with logo, nav links (Sell, Bulk, Buy, Support), Login/Account, and "My Box" cart flyout with count badge
- **Announcement bar**: Promo banner at very top (e.g. "Extra 5% Bonus")
- **Hero section**: Split layout — headline + CTA on left, device/wallet illustration + floating condition badges on right
- **As-seen-on bar**: Logo strip of media mentions (CNBC, USA Today, ZDNet, CNET, PCWorld, LA Times)
- **Category cards**: Grid of icon cards (Phone, Tablet, Laptop, etc.) with hover effect
- **How it works**: 3-step numbered section with illustrations (Get Quote → Ship Free → Get Paid)
- **Trust badges**: 20k+ Reviews, BBB Rating, We Pay Fast, As Seen On, Higher Offer, Elite Rating
- **Testimonials**: Carousel/slider with photo, name, location, star rating
- **FAQ**: Accordion pattern
- **CTA section**: Gradient/colorful banner with "Swap your old tech for cash today" + avatars
- **Footer**: Multi-column with Quick Nav, About Us, Legal, Newsletter signup, contact info, social icons, copyright, language switcher (US/UK)

### Condition Selector (Key UX)
A vertical list of radio-button condition options with:
- Condition name (e.g. "Flawless")
- Short description
- Price display
- Visual indicator (dot/icon)
- Used on device detail page to update quote in real-time

### Device Grid
- Image + device name + "Cash in up to **$XXX**"
- Clickable cards linking to device detail
- Responsive grid (2 cols mobile → 4 cols desktop)

### Box/Cart
- Slide-out drawer or full page
- List of items with device image, condition, price
- Coupon code input
- Estimated total
- Checkout button

### Checkout Flow
- Shipping address (name, street, city, state, zip, phone)
- Carrier selection (FedEx or UPS)
- Payment method selection (Check, PayPal, Zelle)
- Payment details (email for PayPal/Zelle, address for check)
- Shipping speed (Standard free, Expedited paid)
- Order summary
- Data privacy consent checkbox
- Submit → offer number generated

---

## Components (Shared Library)

```
components/
├── ui/
│   ├── Button.tsx            # Variants: primary, secondary, outline, ghost, danger, sizes: sm, md, lg
│   ├── Input.tsx             # Text input with label, error state, icon slot
│   ├── Select.tsx            # Select dropdown
│   ├── Textarea.tsx           # Multi-line input
│   ├── Badge.tsx             # Status badge (success, warning, error, info)
│   ├── Card.tsx              # Container with padding + shadow
│   ├── Modal.tsx             # Overlay dialog
│   ├── Accordion.tsx         # FAQ accordion
│   ├── StarRating.tsx        # 5-star rating display
│   ├── Avatar.tsx            # User/avatar circle with initials
│   ├── Spinner.tsx           # Loading spinner
│   ├── Skeleton.tsx          # Skeleton loader
│   ├── EmptyState.tsx        # Empty box/result state
│   ├── Toast.tsx             # Notification toast
│   └── SearchInput.tsx       # Debounced search with results dropdown
├── layout/
│   ├── Header.tsx            # Top nav bar with cart flyout
│   ├── Footer.tsx            # Multi-column footer
│   ├── AnnouncementBar.tsx   # Promo banner
│   ├── MobileNav.tsx         # Mobile menu
│   └── LanguageSwitcher.tsx  # US/UK toggle
├── home/
│   ├── HeroSection.tsx       # Landing hero
│   ├── AsSeenOn.tsx          # Media logo bar
│   ├── CategoryGrid.tsx      # Category cards
│   ├── HowItWorks.tsx        # 3-step section
│   ├── WhyChooseUs.tsx       # Trust badges
│   ├── TestimonialCarousel.tsx # Review slider
│   ├── FAQSection.tsx        # FAQ accordion section
│   └── CTASection.tsx        # Bottom CTA
├── sell/
│   ├── BrandCard.tsx         # Brand logo card
│   ├── DeviceCard.tsx        # Device model card
│   ├── ConditionSelector.tsx # Radio-list conditions with prices
│   ├── QuoteDisplay.tsx      # Live quote amount
│   └── AddToBoxButton.tsx    # Add to cart with animation
├── box/
│   ├── BoxDrawer.tsx         # Slide-out cart
│   ├── BoxItem.tsx           # Cart line item
│   ├── CouponInput.tsx       # Coupon code input
│   └── BoxSummary.tsx        # Cart totals
├── checkout/
│   ├── ShippingForm.tsx      # Address fields
│   ├── CarrierSelector.tsx   # FedEx/UPS radio
│   ├── PaymentSelector.tsx   # Check/PayPal/Zelle with conditional fields
│   └── OrderSummary.tsx      # Final review
├── dashboard/
│   ├── OrderCard.tsx         # Order summary card
│   ├── OrderTimeline.tsx     # Status progress
│   └── OrderDetail.tsx       # Full order view
├── forms/
│   ├── BulkQuoteForm.tsx     # Multi-item + upload form
│   ├── ITADForm.tsx          # ITAD contact form
│   ├── SupportForm.tsx       # Contact form
│   └── NewsletterForm.tsx    # Email signup
└── shared/
    ├── DeviceSearch.tsx      # Global device search
    ├── SEOHead.tsx           # Meta tags
    └── Breadcrumbs.tsx       # Page breadcrumbs
```

---

## Business Logic

### Selling Flow
1. User lands on `/sell` → sees category grid + search bar + quick links (iPhone, Samsung, iPad, MacBook)
2. Clicks category → brand listings (`/sell/[category]`)
3. Clicks brand → device model grid (`/sell/[category]/[brand]`)
4. Clicks device → detail page with condition selector, live price, specs, FAQs
5. Selects condition → quote updates in real-time via `device_prices`
6. Clicks "Add to Box" → item added to box (cart), stored in DB with user session or Clerk user ID
7. User can continue shopping or view box
8. In box: adjust quantities, remove items, apply coupon code, see estimated total
9. Proceed to checkout → shipping info, carrier, payment method, submit
10. Order created with `offer_number`, status = `quote_pending`, 21-day expiry
11. User receives email with shipping label instructions
12. User ships device → tracking updated
13. On receipt → device inspected → status moves through flow
14. If condition matches → payment processed
15. If condition differs → revised offer sent, user has 3 days to accept/decline
16. If declined → device shipped back free
17. Payment via Check/PayPal/Zelle within 24-48h of approval

### Coupon System
- Code applied at box/checkout
- Validates against: active status, expiry, min order, max uses, per-user cap
- Percentage discounts capped per item and per order total
- Applies discount to `total_cents`

### Quote Expiration
- All quotes valid for 21 days (`expires_at` on orders)
- If device arrives after expiry → re-evaluated at current market rates

### Bulk / ITAD Flow
- User fills out form with product rows (name, quantity, condition, category, specs) OR uploads spreadsheet
- Attachments: .doc, .docx, .xls, .xlsx, .pdf (max 5MB)
- Dedicated relationship manager responds within 24h
- Same condition definitions as retail but includes "Very Good" tier between Good and Flawless
- Payment options: Check, PayPal, Zelle, ACH Credit, Wire
- Optional data destruction service (NIST standard secure erase)

### Affiliate Program
- Managed via ShareASale (external)
- Commission: 10% up to $350, $35 flat $350-$1000, $50 over $1000
- 60-day cookie duration
- Page on site explains program and links to ShareASale signup
- `affiliate_commissions` table for internal tracking

### Newsletter
- Email signup in footer
- Stored in `newsletter_subscriptions`
- Locale-aware (US/UK)

### Internationalization
- Language switcher in header: US (en) / UK (en-GB)
- Impacts pricing, shipping options, addresses

### Authentication
- Clerk handles: sign up, sign in, Google SSO, password reset, 2FA, account settings
- Middleware protects `/dashboard/*`, `/sell/box/checkout`, `/account/*`
- `user_id` from Clerk stored as text FK in orders, addresses, etc.

---

## API Routes (`app/api/`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/categories` | GET | List categories |
| `/api/categories/[slug]/brands` | GET | Brands in category |
| `/api/brands/[slug]/devices` | GET | Devices in brand |
| `/api/devices/[id]/price?condition=` | GET | Get price for device+condition |
| `/api/box` | GET | Get current user's box items |
| `/api/box` | POST | Add item to box |
| `/api/box/[itemId]` | PATCH | Update bo   x item (condition) |
| `/api/box/[itemId]` | DELETE | Remove from box |
| `/api/box/coupon` | POST | Apply coupon code |
| `/api/box/coupon` | DELETE | Remove coupon |
| `/api/checkout` | POST | Submit order |
| `/api/orders` | GET | User's orders list |
| `/api/orders/[id]` | GET | Single order detail |
| `/api/orders/[id]/reinspect` | POST | Request reinspection |
| `/api/orders/[id]/accept-revision` | POST | Accept revised offer |
| `/api/orders/[id]/decline-revision` | POST | Decline revision, request return |
| `/api/addresses` | GET | User's saved addresses |
| `/api/addresses` | POST | Save address |
| `/api/bulk-quote` | POST | Submit bulk quote request |
| `/api/itad-quote` | POST | Submit ITAD quote request |
| `/api/contact` | POST | Submit contact form |
| `/api/newsletter` | POST | Subscribe email |
| `/api/search` | GET | Global device search |
| `/api/coupon/validate` | POST | Validate coupon code without applying |

---

## Dependencies to Install

```bash
npm install drizzle-orm @neondatabase/serverless @clerk/nextjs
npm install -D drizzle-kit
```

---

## Verification

```bash
npm run lint
npm run build
```

---

## Build Order (Recommended)

1. **Setup**: Install deps, configure Neon + Drizzle + Clerk env vars, create schema, run migrations
2. **Design system**: Global CSS variables, Button, Input, Card, Badge, Modal, Skeleton components
3. **Layout**: Header (with cart flyout), Footer, AnnouncementBar, LanguageSwitcher
4. **Landing page**: Hero, AsSeenOn, CategoryGrid, HowItWorks, WhyChooseUs, TestimonialCarousel, FAQSection, CTASection
5. **Sell flow**: Category → Brand → Device → Condition → Quote → Add to Box
6. **Box/Cart**: View box, update items, apply coupon
7. **Checkout**: Shipping, carrier, payment method, submit → order creation
8. **Dashboard**: Order list, order detail with timeline
9. **Bulk/ITAD**: Quote request forms with file upload
10. **Support/FAQ**: Contact form, FAQ accordion
11. **Affiliate page**: Static info + ShareASale link
12. **Legal pages**: Static content
13. **Search**: Global device search
14. **Polish**: Newsletter, SEO metadata, locale switching, coupon promo bar, 404 page
