export interface OrderItem {
  deviceName: string;
  conditionLabel: string;
  conditionSlug: string;
  offeredPriceCents: number;
  finalPriceCents: number | null;
  imei?: string;
}

export interface Order {
  offerNumber: string;
  status: string;
  subtotalCents: number;
  couponDiscountCents: number;
  totalCents: number;
  paymentMethod: string;
  paymentEmail?: string;
  shippingMethod: string;
  carrier: string;
  trackingNumber?: string;
  submittedAt: string;
  items: OrderItem[];
}

const now = new Date();

function daysAgo(days: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const mockOrders: Order[] = [
  {
    offerNumber: "IWM-AX3R7",
    status: "completed",
    subtotalCents: 89000,
    couponDiscountCents: 0,
    totalCents: 89000,
    paymentMethod: "paypal",
    paymentEmail: "john@example.com",
    shippingMethod: "standard",
    carrier: "fedex",
    trackingNumber: "FDX1234567890",
    submittedAt: daysAgo(14),
    items: [
      {
        deviceName: "iPhone 16 Pro Max",
        conditionLabel: "Flawless",
        conditionSlug: "flawless",
        offeredPriceCents: 89000,
        finalPriceCents: 89000,
        imei: "356938123456789",
      },
    ],
  },
  {
    offerNumber: "IWM-K9PL2",
    status: "inspecting",
    subtotalCents: 72000,
    couponDiscountCents: 0,
    totalCents: 72000,
    paymentMethod: "zelle",
    shippingMethod: "standard",
    carrier: "ups",
    trackingNumber: "UPS1Z876543210",
    submittedAt: daysAgo(7),
    items: [
      {
        deviceName: "Samsung Galaxy S25 Ultra",
        conditionLabel: "Good",
        conditionSlug: "good",
        offeredPriceCents: 72000,
        finalPriceCents: null,
      },
    ],
  },
  {
    offerNumber: "IWM-5BQN8",
    status: "offer_revised",
    subtotalCents: 85000,
    couponDiscountCents: 5000,
    totalCents: 80000,
    paymentMethod: "check",
    shippingMethod: "standard",
    carrier: "fedex",
    submittedAt: daysAgo(3),
    items: [
      {
        deviceName: "MacBook Pro 16\" M4",
        conditionLabel: "Flawless",
        conditionSlug: "flawless",
        offeredPriceCents: 85000,
        finalPriceCents: null,
        imei: "FVF2ABCDEFGH",
      },
    ],
  },
  {
    offerNumber: "IWM-DT7HK",
    status: "cancelled",
    subtotalCents: 45000,
    couponDiscountCents: 0,
    totalCents: 45000,
    paymentMethod: "paypal",
    shippingMethod: "standard",
    carrier: "fedex",
    submittedAt: daysAgo(30),
    items: [
      {
        deviceName: "Google Pixel 9 Pro",
        conditionLabel: "Fair",
        conditionSlug: "fair",
        offeredPriceCents: 45000,
        finalPriceCents: null,
      },
    ],
  },
  {
    offerNumber: "IWM-2RFX6",
    status: "payment_sent",
    subtotalCents: 62500,
    couponDiscountCents: 0,
    totalCents: 62500,
    paymentMethod: "paypal",
    paymentEmail: "alex@example.com",
    shippingMethod: "expedited",
    carrier: "ups",
    trackingNumber: "UPS1Z987654321",
    submittedAt: daysAgo(10),
    items: [
      {
        deviceName: "iPhone 16",
        conditionLabel: "Brand New",
        conditionSlug: "brand-new",
        offeredPriceCents: 62500,
        finalPriceCents: 62500,
      },
      {
        deviceName: "Apple Watch Series 9",
        conditionLabel: "Good",
        conditionSlug: "good",
        offeredPriceCents: 12000,
        finalPriceCents: 12000,
      },
    ],
  },
];

export function getOrderById(offerNumber: string): Order | undefined {
  return mockOrders.find((o) => o.offerNumber === offerNumber);
}
