import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  decimal,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  imageUrl: text("image_url"),
  role: varchar("role", { length: 20 }).default("user"),
  isActive: boolean("is_active").default(true),
  lastSignInAt: timestamp("last_sign_in_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  icon: text("icon"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const deviceConditions = pgTable("device_conditions", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 50 }).unique().notNull(),
  label: varchar("label", { length: 100 }).notNull(),
  description: text("description"),
  isBulk: boolean("is_bulk").default(false),
  isRetail: boolean("is_retail").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id")
    .notNull()
    .references(() => brands.id),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  imageUrl: text("image_url"),
  maxQuoteCents: integer("max_quote_cents"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const devicePrices = pgTable("device_prices", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id")
    .notNull()
    .references(() => devices.id),
  conditionSlug: varchar("condition_slug", { length: 50 }).notNull(),
  priceCents: integer("price_cents").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  valueCents: integer("value_cents"),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  maxApplyCents: integer("max_apply_cents"),
  maxApplyTotalCents: integer("max_apply_total_cents"),
  minOrderCents: integer("min_order_cents").default(0),
  maxUses: integer("max_uses"),
  maxUsesPerUser: integer("max_uses_per_user"),
  isActive: boolean("is_active").default(true),
  startsAt: timestamp("starts_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  offerNumber: varchar("offer_number", { length: 20 }).unique().notNull(),
  status: varchar("status", { length: 30 }).notNull().default("quote_pending"),
  subtotalCents: integer("subtotal_cents").default(0),
  couponId: integer("coupon_id").references(() => coupons.id),
  couponDiscountCents: integer("coupon_discount_cents").default(0),
  totalCents: integer("total_cents").default(0),
  paymentMethod: varchar("payment_method", { length: 20 }),
  paymentEmail: text("payment_email"),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"),
  shippingMethod: varchar("shipping_method", { length: 20 }),
  shippingLabelUrl: text("shipping_label_url"),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  carrier: varchar("carrier", { length: 20 }),
  expiresAt: timestamp("expires_at"),
  submittedAt: timestamp("submitted_at"),
  deviceReceivedAt: timestamp("device_received_at"),
  inspectedAt: timestamp("inspected_at"),
  paidAt: timestamp("paid_at"),
  cancelledAt: timestamp("cancelled_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  deviceId: integer("device_id").references(() => devices.id),
  deviceName: varchar("device_name", { length: 200 }).notNull(),
  conditionSlug: varchar("condition_slug", { length: 50 }),
  conditionLabel: varchar("condition_label", { length: 100 }),
  offeredPriceCents: integer("offered_price_cents").notNull(),
  finalPriceCents: integer("final_price_cents"),
  hasAccessories: boolean("has_accessories").default(false),
  imei: varchar("imei", { length: 50 }),
  serialNumber: varchar("serial_number", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderTimeline = pgTable("order_timeline", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  event: varchar("event", { length: 50 }).notNull(),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderReinspections = pgTable("order_reinspections", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 20 }).default("requested"),
  result: text("result"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: varchar("type", { length: 10 }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  street: text("street").notNull(),
  street2: text("street2"),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  zip: varchar("zip", { length: 20 }).notNull(),
  country: varchar("country", { length: 10 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const affiliateCommissions = pgTable("affiliate_commissions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  orderId: integer("order_id").references(() => orders.id),
  amountCents: integer("amount_cents").notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  referralCode: varchar("referral_code", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  locale: varchar("locale", { length: 10 }).default("en"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bulkQuoteRequests = pgTable("bulk_quote_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  companyName: varchar("company_name", { length: 200 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  specsFileUrl: text("specs_file_url"),
  comments: text("comments"),
  type: varchar("type", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bulkQuoteItems = pgTable("bulk_quote_items", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id")
    .notNull()
    .references(() => bulkQuoteRequests.id),
  productName: varchar("product_name", { length: 200 }).notNull(),
  quantity: integer("quantity").notNull(),
  conditionSlug: varchar("condition_slug", { length: 50 }),
  category: varchar("category", { length: 50 }),
  specs: text("specs"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
