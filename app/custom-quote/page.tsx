import type { Metadata } from "next";
import { CustomQuoteForm } from "@/components/forms/CustomQuoteForm";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title: "Get a Custom Quote",
  description: "Have a device not listed on our platform? Submit a custom quote request and our team will get back to you within 24 hours.",
  path: "/custom-quote",
});

export default function CustomQuotePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-white text-zinc-900 py-12 lg:py-16 overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            Custom Quote
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-none tracking-tight">
            Get a Custom Quote
          </h1>
          <p className="mt-4 text-lg text-zinc-500 max-w-xl mx-auto">
            Don&apos;t see your device listed? Tell us what you have and we&apos;ll get back to you
            with a tailored offer within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <CustomQuoteForm />
        </div>
      </section>
    </div>
  );
}
