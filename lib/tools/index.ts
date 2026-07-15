import { db } from "@/db";
import {
  categories,
  brands,
  devices,
  devicePrices,
  deviceConditions,
  orders,
  orderItems,
} from "@/db/schema";
import { eq, and, ilike, asc, inArray } from "drizzle-orm";

export const toolDefinitions = [
  {
    type: "function" as const,
    function: {
      name: "get_categories",
      description: "List all active categories (e.g., Phones, Tablets, Laptops)",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_brands",
      description: "List brands under a category",
      parameters: {
        type: "object",
        properties: {
          categorySlug: {
            type: "string",
            description: "Category slug (e.g., phone, tablet, laptop)",
          },
        },
        required: ["categorySlug"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_models",
      description: "List device models under a brand",
      parameters: {
        type: "object",
        properties: {
          brandSlug: {
            type: "string",
            description: "Brand slug (e.g., iphone, samsung, google-pixel)",
          },
        },
        required: ["brandSlug"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_device_price",
      description: "Get the price for a specific device in a given condition",
      parameters: {
        type: "object",
        properties: {
          deviceId: {
            type: "number",
            description: "Device ID",
          },
          conditionSlug: {
            type: "string",
            description: "Condition slug (brand-new, flawless, very-good, good, fair, broken)",
          },
        },
        required: ["deviceId", "conditionSlug"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_conditions",
      description: "List all available device conditions with descriptions",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "search_devices",
      description: "Search for devices by name (e.g., iPhone 16 Pro Max, Galaxy S25)",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query (device name)",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_order_status",
      description: "Look up a public order status by offer number (e.g., IWM-XXXXX)",
      parameters: {
        type: "object",
        properties: {
          offerNumber: {
            type: "string",
            description: "Offer number like IWM-XXXXX",
          },
        },
        required: ["offerNumber"],
      },
    },
  },
];

export async function executeTool(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "get_categories":
      return getCategories();
    case "get_brands":
      return getBrands(args.categorySlug as string);
    case "get_models":
      return getModels(args.brandSlug as string);
    case "get_device_price":
      return getDevicePrice(args.deviceId as number, args.conditionSlug as string);
    case "get_conditions":
      return getConditions();
    case "search_devices":
      return searchDevices(args.query as string);
    case "get_order_status":
      return getOrderStatus(args.offerNumber as string);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function getCategories() {
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.sortOrder));
  return rows;
}

async function getBrands(categorySlug: string) {
  const [cat] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(and(eq(categories.slug, categorySlug), eq(categories.isActive, true)))
    .limit(1);
  if (!cat) return { error: `Category "${categorySlug}" not found` };

  const rows = await db
    .select({ id: brands.id, name: brands.name, slug: brands.slug })
    .from(brands)
    .where(and(eq(brands.categoryId, cat.id), eq(brands.isActive, true)))
    .orderBy(asc(brands.sortOrder));
  return rows;
}

async function getModels(brandSlug: string) {
  const [brand] = await db
    .select({ id: brands.id, name: brands.name })
    .from(brands)
    .where(and(eq(brands.slug, brandSlug), eq(brands.isActive, true)))
    .limit(1);
  if (!brand) return { error: `Brand "${brandSlug}" not found` };

  const rows = await db
    .select({
      id: devices.id,
      name: devices.name,
      slug: devices.slug,
      maxQuoteCents: devices.maxQuoteCents,
    })
    .from(devices)
    .where(and(eq(devices.brandId, brand.id), eq(devices.isActive, true)))
    .orderBy(asc(devices.sortOrder));
  return { brand: brand.name, models: rows };
}

async function getDevicePrice(deviceId: number, conditionSlug: string) {
  const [device] = await db
    .select({ name: devices.name })
    .from(devices)
    .where(and(eq(devices.id, deviceId), eq(devices.isActive, true)))
    .limit(1);
  if (!device) return { error: `Device with ID ${deviceId} not found` };

  const [price] = await db
    .select({ priceCents: devicePrices.priceCents })
    .from(devicePrices)
    .where(
      and(
        eq(devicePrices.deviceId, deviceId),
        eq(devicePrices.conditionSlug, conditionSlug),
        eq(devicePrices.isActive, true),
      ),
    )
    .limit(1);

  const [condition] = await db
    .select({ label: deviceConditions.label })
    .from(deviceConditions)
    .where(eq(deviceConditions.slug, conditionSlug))
    .limit(1);

  if (!price) {
    return {
      device: device.name,
      condition: condition?.label || conditionSlug,
      error: "No price available for this combination",
    };
  }

  return {
    device: device.name,
    condition: condition?.label || conditionSlug,
    price: `$${(price.priceCents / 100).toFixed(2)}`,
    priceCents: price.priceCents,
  };
}

async function getConditions() {
  const rows = await db
    .select({
      slug: deviceConditions.slug,
      label: deviceConditions.label,
      description: deviceConditions.description,
    })
    .from(deviceConditions)
    .where(eq(deviceConditions.isRetail, true))
    .orderBy(asc(deviceConditions.sortOrder));
  return rows;
}

async function searchDevices(query: string) {
  const rows = await db
    .select({
      id: devices.id,
      name: devices.name,
      slug: devices.slug,
      maxQuoteCents: devices.maxQuoteCents,
    })
    .from(devices)
    .where(
      and(eq(devices.isActive, true), ilike(devices.name, `%${query}%`)),
    )
    .orderBy(asc(devices.sortOrder))
    .limit(10);

  return rows;
}

async function getOrderStatus(offerNumber: string) {
  const [order] = await db
    .select({
      id: orders.id,
      offerNumber: orders.offerNumber,
      status: orders.status,
      totalCents: orders.totalCents,
      createdAt: orders.createdAt,
      submittedAt: orders.submittedAt,
      deviceReceivedAt: orders.deviceReceivedAt,
      inspectedAt: orders.inspectedAt,
      paidAt: orders.paidAt,
    })
    .from(orders)
    .where(eq(orders.offerNumber, offerNumber))
    .limit(1);

  if (!order) return { error: `Order "${offerNumber}" not found` };

  const items = await db
    .select({
      deviceName: orderItems.deviceName,
      conditionLabel: orderItems.conditionLabel,
      offeredPriceCents: orderItems.offeredPriceCents,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return {
    ...order,
    totalCents: undefined,
    total: `$${((order.totalCents || 0) / 100).toFixed(2)}`,
    items,
  };
}
