import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { CustomQuoteForm } from "@/components/forms/CustomQuoteForm";

export const metadata: Metadata = {
  title: "Get a Custom Quote | ItsWorthMore",
  description: "Have a device not listed on our platform? Submit a custom quote request and our team will get back to you within 24 hours.",
};

const benefits = [
  {
    title: "Personalized Pricing",
    description: "Our team evaluates your specific device to give you the best possible offer — even if it's not in our standard catalog.",
  },
  {
    title: "Fast Response",
    description: "Get a custom quote within 24 hours. No automated systems, just real people reviewing your request.",
  },
  {
    title: "Bulk & Rare Devices",
    description: "Have a collection, prototype, or rare model? We specialize in unique and bulk electronics valuations.",
  },
  {
    title: "No Obligation",
    description: "Receive your quote with zero commitment. Accept, decline, or negotiate — the choice is entirely yours.",
  },
];

export default function CustomQuotePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-zinc-50 py-20 lg:py-32">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Custom Quote</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-none tracking-tight text-zinc-900">
            Don&apos;t see your device?{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              We&apos;ll price it
            </span>
          </h1>
          <p className="mt-4 text-lg text-zinc-500 max-w-xl mx-auto">
            Tell us what you have and our team will get back to you with a tailored offer within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Why Request a Custom Quote</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 font-serif">
              Special devices deserve special pricing
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <Card
                key={b.title}
                padding="lg"
                className="text-center hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <h3 className="font-semibold text-zinc-900">{b.title}</h3>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{b.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16 lg:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Submit Your Request</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 font-serif">
              Tell us about your device
            </h2>
            <p className="mt-3 text-zinc-500">
              Fill out the form below with as much detail as possible. The more we know, the more accurate your quote.
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Card padding="lg" className="shadow-md border-zinc-200">
              <CustomQuoteForm />
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 font-serif">
            Ready for an instant quote instead?
          </h2>
          <p className="mt-3 text-zinc-500">
            Browse our catalog for instant pricing on hundreds of devices.
          </p>
          <div className="mt-8">
            <a
              href="/sell"
              className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Browse devices
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
