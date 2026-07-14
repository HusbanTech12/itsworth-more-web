import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | CashingTech",
  description: "Tips, guides, and news about selling your used electronics for cash. Learn how to get the most value from your devices.",
};

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

const stats = [
  { value: "50+", label: "Articles & guides" },
  { value: "100K+", label: "Monthly readers" },
  { value: "5min", label: "Average read time" },
  { value: "Updated", label: "Weekly" },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-zinc-50 py-20 lg:py-32">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Blog</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-none tracking-tight text-zinc-900">
            Tips &amp;{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Guides
            </span>
          </h1>
          <p className="mt-4 text-lg text-zinc-500 max-w-xl mx-auto">
            Learn how to get the most value from your used electronics and stay up to date with the latest trade-in news.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-6 text-center border border-zinc-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
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

      <section className="bg-zinc-50 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 font-serif">
            Ready to turn your old tech into cash?
          </h2>
          <p className="mt-3 text-zinc-500">
            Get your instant quote in under 60 seconds. No obligations, no hassle.
          </p>
          <div className="mt-8">
            <a
              href="/sell"
              className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Start selling
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
