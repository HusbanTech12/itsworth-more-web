import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Blog | CashingTech",
  description: "Tips, guides, and news about selling your used electronics for cash. Learn how to get the most value from your devices.",
};

const stats = [
  { value: "50+", label: "Articles & guides" },
  { value: "100K+", label: "Monthly readers" },
  { value: "5min", label: "Average read time" },
  { value: "Updated", label: "Weekly" },
];

function formatDate(date: Date | string | null) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function BlogPage() {
  let posts: { slug: string; title: string; excerpt: string | null; imageUrl: string | null; publishedAt: Date | null }[] = [];

  try {
    posts = await db
      .select({
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        imageUrl: blogPosts.imageUrl,
        publishedAt: blogPosts.publishedAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt));
  } catch {
    posts = [];
  }

  return (
    <div className="min-h-screen bg-cream">
      <section className="relative overflow-hidden bg-cream py-20 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange mb-4">Blog</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading leading-none tracking-tight text-ink">
            Tips &amp;{" "}
            <span className="text-orange">
              Guides
            </span>
          </h1>
          <p className="mt-4 text-lg text-ink-muted max-w-xl mx-auto">
            Learn how to get the most value from your used electronics and stay up to date with the latest trade-in news.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-6 text-center border border-border shadow-sm hover:shadow-lg hover:border-orange/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <p className="text-2xl sm:text-3xl font-bold text-orange">{stat.value}</p>
                <p className="mt-1 text-sm text-ink-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-ink-muted text-lg">No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-orange/30 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="aspect-[16/10] bg-cream overflow-hidden">
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-ink-muted mb-2">{formatDate(post.publishedAt)}</p>
                    <h2 className="text-base font-semibold text-ink group-hover:text-orange transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <p className="text-sm font-medium text-orange mt-3 group-hover:underline">
                      Read more &rarr;
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink font-heading">
            Ready to turn your old tech into cash?
          </h2>
          <p className="mt-3 text-ink-muted">
            Get your instant quote in under 60 seconds. No obligations, no hassle.
          </p>
          <div className="mt-8">
            <Link
              href="/sell"
              className="inline-flex items-center px-6 py-3 rounded-md bg-orange text-white font-medium hover:bg-orange/90 transition-colors hover:shadow-lg hover:shadow-orange/30 hover:-translate-y-0.5"
            >
              Start selling
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
