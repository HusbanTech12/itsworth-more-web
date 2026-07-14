import Link from "next/link";

const posts = [
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

const blockStyles = ["bg-ink", "bg-orange", "bg-[#1a1a1a]"];

export function BlogCardGrid() {
  return (
    <section className="bg-cream py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange mb-3">
            DFW TECH TIPS & LOCAL GUIDES
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-tight font-display">
            The CashingTech Blog
          </h2>
          <p className="mt-3 text-ink-muted max-w-xl mx-auto">
            Tips, local guides, and everything you need to know about selling your tech in Dallas-Fort Worth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`${blockStyles[i]} rounded-t-2xl aspect-[4/3] relative p-5 flex flex-col justify-end overflow-hidden`}>
                <img
                  src={post.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="relative z-10 text-xs font-semibold uppercase tracking-widest text-lime mb-2">
                  DFW GUIDE
                </p>
                <h3 className="relative z-10 text-xl font-bold text-white leading-tight">
                  {post.title}
                </h3>
              </div>
              <div className="bg-white rounded-b-2xl border border-border border-t-0 p-5">
                <p className="text-sm text-ink-muted leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <p className="text-sm font-semibold text-orange mt-3 group-hover:underline">
                  Read More →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
