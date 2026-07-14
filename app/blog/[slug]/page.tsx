import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  image: string;
}

const posts: Record<string, BlogPost> = {
  "how-to-get-the-most-money-for-your-used-iphone": {
    slug: "how-to-get-the-most-money-for-your-used-iphone",
    title: "How to Get the Most Money for Your Used iPhone",
    excerpt: "Maximize your trade-in value with these simple tips.",
    date: "June 15, 2026",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80&fit=crop&auto=format",
    content: `
      <p>Selling your used iPhone doesn't have to be a hassle. With a little preparation, you can maximize your payout and make the process smooth. Here are our top tips:</p>
      <h2>1. Back Up and Wipe Your Data</h2>
      <p>Before selling, make sure to back up your iPhone to iCloud or a computer. Then go to Settings > General > Transfer or Reset iPhone and select "Erase All Content and Settings." This ensures your personal data is completely removed.</p>
      <h2>2. Clean Your Device Thoroughly</h2>
      <p>A clean phone makes a great first impression. Use a soft, slightly damp microfiber cloth to wipe down the screen, back, and sides. Avoid using harsh chemicals or abrasive materials.</p>
      <h2>3. Include Original Accessories</h2>
      <p>Including the original charger, cable, and box can increase your offer. Many buyers prefer devices that come with original accessories, even if the accessories show normal wear.</p>
      <h2>4. Remove Screen Protectors and Cases</h2>
      <p>Remove any screen protectors or cases before taking photos. Buyers want to see the actual condition of the device, not accessories that may hide scratches or wear.</p>
      <h2>5. Be Honest About Condition</h2>
      <p>Accurate condition descriptions lead to faster sales and fewer disputes. If your device has scratches, dents, or other issues, disclose them upfront. Honesty builds trust and ensures a smooth transaction.</p>
      <p>Follow these steps and you'll be well on your way to getting the most value for your used iPhone!</p>
    `,
  },
  "what-happens-to-your-old-electronics-after-trade-in": {
    slug: "what-happens-to-your-old-electronics-after-trade-in",
    title: "What Happens to Your Old Electronics After Trade-In",
    excerpt: "Follow the journey of your traded-in device.",
    date: "June 1, 2026",
    image: "https://images.unsplash.com/photo-1534996858221-380b92700493?w=800&q=80&fit=crop&auto=format",
    content: `
      <p>Ever wondered what happens after you send us your old device? Here's a behind-the-scenes look at our trade-in process.</p>
      <h2>Step 1: Receiving and Logging</h2>
      <p>When your device arrives at our facility, it's logged into our system and assigned a unique tracking ID. This ensures your device never gets lost and you can track its progress at every stage.</p>
      <h2>Step 2: Inspection</h2>
      <p>Our trained technicians perform a thorough inspection of every device. They check the screen for scratches or cracks, test all buttons and ports, verify camera functionality, and run diagnostic tests on the battery and internal components.</p>
      <h2>Step 3: Data Wiping</h2>
      <p>We perform a factory reset and use certified data erasure software to ensure all your personal information is permanently removed. This meets NIST and DOD standards for data security.</p>
      <h2>Step 4: Grading and Pricing</h2>
      <p>Based on the inspection results, we assign a grade to your device. If the condition matches what you described, you receive the full quoted price. If there are discrepancies, we send a revised offer.</p>
      <h2>Step 5: Refurbishment or Recycling</h2>
      <p>Devices in good condition are cleaned, refurbished, and listed for resale. Devices that are too old or damaged are responsibly recycled through certified e-waste partners.</p>
    `,
  },
  "top-5-most-valuable-phones-to-sell-in-2026": {
    slug: "top-5-most-valuable-phones-to-sell-in-2026",
    title: "Top 5 Most Valuable Phones to Sell in 2026",
    excerpt: "Discover which phones hold their value best this year.",
    date: "May 20, 2026",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&fit=crop&auto=format",
    content: `
      <p>Not all phones hold their value equally. Here are the top 5 smartphones that are fetching the highest trade-in values in 2026.</p>
      <h2>1. iPhone 17 Pro Max</h2>
      <p>Apple's latest flagship continues to lead the market with exceptional resale value. With its titanium design, A19 chip, and pro-grade camera system, demand remains high.</p>
      <h2>2. Samsung Galaxy S25 Ultra</h2>
      <p>Samsung's premium offering holds its value well thanks to its S Pen integration, stunning display, and powerful camera array with AI features.</p>
      <h2>3. iPhone 17 Pro</h2>
      <p>The slightly smaller sibling of the Pro Max still commands impressive trade-in prices, especially in excellent condition.</p>
      <h2>4. Google Pixel 9 Pro</h2>
      <p>Google's flagship has gained popularity for its computational photography and clean Android experience, translating to solid resale value.</p>
      <h2>5. iPhone 16 Pro Max</h2>
      <p>Last year's flagship remains in high demand and offers excellent trade-in value for those looking to upgrade to the latest model.</p>
      <p>Tip: The best time to sell is typically within the first year of release, while demand and value are at their peak.</p>
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return {};
  return {
    title: `${post.title} — CashingTech Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-xs text-ink-muted mb-4">
            <Link href="/blog" className="hover:text-ink transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-ink font-medium truncate">{post.title}</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange mb-3">Blog</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink font-heading leading-tight">
            {post.title}
          </h1>
          <p className="text-sm text-ink-muted mt-3">{post.date}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-cream mb-10">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className="prose prose-zinc prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-orange hover:underline"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
