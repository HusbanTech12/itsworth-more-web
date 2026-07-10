import type { Metadata } from "next";

const siteName = "ItsWorthMore";
const defaultDescription = "Turn clutter into cash. Sell your used electronics in minutes with instant quotes, free shipping, and fast payments.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.itsworthmore.com";

interface SEOParams {
  title: string;
  description?: string;
  path?: string;
  noindex?: boolean;
}

export function generateMetadata({
  title,
  description = defaultDescription,
  path = "",
  noindex = false,
}: SEOParams): Metadata {
  const fullTitle = `${title} — ${siteName}`;
  const url = `${siteUrl}${path}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      type: "website",
    },
    ...(noindex && { robots: { index: false, follow: false } }),
  };
}
