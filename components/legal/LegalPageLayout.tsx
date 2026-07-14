import type { ReactNode } from "react";

interface LegalPageProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, subtitle, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-cream">
      <section className="relative overflow-hidden bg-cream py-10 lg:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-ink">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-lg text-ink-muted max-w-xl mx-auto">{subtitle}</p>
          )}
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 sm:p-10 text-sm sm:text-base text-ink-muted leading-relaxed [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:mt-8 [&_h2]:mb-3 [&_h2:first-child]:mt-0 [&_p]:text-ink-muted [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-3 [&_ul]:mb-4 [&_li]:text-ink-muted [&_li]:mb-1.5 [&_strong]:text-ink [&_strong]:font-semibold">
          {children}
        </div>
      </div>
    </div>
  );
}
