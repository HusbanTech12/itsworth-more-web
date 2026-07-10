import Link from "next/link";
import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title: "Blog",
  description: "Tips, guides, and news about selling your used electronics for cash. Learn how to get the most value from your devices.",
  path: "/blog",
});

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

const posts: BlogPost[] = [
  {
    slug: "how-to-get-the-most-money-for-your-used-iphone",
    title: "How to Get the Most Money for Your Used iPhone",
    excerpt: "Maximize your trade-in value with these simple tips for preparing, cleaning, and pricing your iPhone before selling.",
    date: "June 15, 2026",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80&fit=crop&auto=format",
  },
  {
    slug: "what-happens-to-your-old-electronics-after-trade-in",
    title: "What Happens to Your Old Electronics After Trade-In",
    excerpt: "Follow the journey of your traded-in device — from inspection and data wiping to refurbishment and resale or responsible recycling.",
    date: "June 1, 2026",
    image: "https://images.unsplash.com/photo-1534996858221-380b92700493?w=800&q=80&fit=crop&auto=format",
  },
  {
    slug: "top-5-most-valuable-phones-to-sell-in-2026",
    title: "Top 5 Most Valuable Phones to Sell in 2026",
    excerpt: "Discover which smartphone models are holding their value best this year and how much you can expect to get for them.",
    date: "May 20, 2026",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&fit=crop&auto=format",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-white text-zinc-900 py-12 lg:py-16 overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Blog</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-none tracking-tight">
            Tips &amp; Guides
          </h1>
          <p className="mt-4 text-lg text-zinc-500 max-w-xl mx-auto">
            Learn how to get the most value from your used electronics and stay up to date with the latest trade-in news.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <div className="aspect-[16/10] bg-zinc-50 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-zinc-400 mb-2">{post.date}</p>
                  <h2 className="text-base font-semibold text-zinc-900 group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <p className="text-sm font-medium text-primary mt-3 group-hover:underline">
                    Read more &rarr;
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
