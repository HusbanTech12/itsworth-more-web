import type { ReactNode } from "react";

interface LegalPageProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, subtitle, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-800 text-white py-16 lg:py-24">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-lg text-zinc-300 max-w-xl mx-auto">{subtitle}</p>
          )}
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6 sm:p-10">
          <div className="prose prose-zinc prose-sm sm:prose-base max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
