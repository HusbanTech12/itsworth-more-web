import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { BulkQuoteForm } from "@/components/forms/BulkQuoteForm";

export const metadata: Metadata = {
  title: "Sell Electronics in Bulk | Bulk Trade-In Program | ItsWorthMore",
  description:
    "Get premium pricing on bulk quantities of 20+ devices. Free shipping, fast payment, dedicated relationship manager, and NIST data destruction.",
};

const benefits = [
  {
    title: "Higher Offers",
    description: "Get premium pricing for bulk quantities of 20+ devices.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    title: "Free Shipping",
    description: "We provide prepaid shipping labels for all bulk shipments.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: "Fast Payment",
    description: "Receive payment within 24-48 hours of inspection.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Dedicated Manager",
    description: "A dedicated relationship manager handles your account.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: "Data Destruction",
    description: "Optional NIST-standard secure data erasure included.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Flexible Payment",
    description: "Check, PayPal, Zelle, ACH Credit, or Wire transfer.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
];

const faqs = [
  { q: "What is the minimum quantity for bulk?", a: "We require a minimum of 20 devices for bulk pricing." },
  { q: "How are devices evaluated?", a: "Our team inspects each device against the same condition tiers we use for retail." },
  { q: "Do you offer data destruction?", a: "Yes, we provide NIST-standard secure data erasure at no extra cost." },
  { q: "What payment methods are available?", a: "Check, PayPal, Zelle, ACH Credit, and Wire transfer." },
];

export default function BulkTradeInPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&q=70&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 via-zinc-800/50 to-zinc-900/50" />
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/80 mb-4 animate-fade-in">
            Bulk Trade-In Program
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-slide-up">
            Sell Electronics <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">in Bulk</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-300 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Get premium pricing on bulk quantities of 20+ devices. Free shipping,
            fast payment, and a dedicated relationship manager.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Why Go Bulk</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            Everything you need, nothing you don&apos;t
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <Card key={b.title} padding="lg" className="text-center hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-300 animate-slide-up group" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-300">
                {b.icon}
              </div>
              <h3 className="font-semibold text-zinc-900">{b.title}</h3>
              <p className="text-sm text-zinc-500 mt-2">{b.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Get Started</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
              Request a Bulk Quote
            </h2>
            <p className="mt-3 text-zinc-500">
              Fill out the form below and a dedicated relationship manager will reach out within 24 hours.
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Card padding="lg" className="shadow-md border-zinc-200">
              <BulkQuoteForm />
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-10 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            Bulk Trade-In Questions
          </h2>
        </div>
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {faqs.map((faq) => (
            <Card key={faq.q} padding="md" className="hover:shadow-md hover:border-primary/20 transition-all duration-300">
              <h3 className="font-semibold text-zinc-900 text-sm">{faq.q}</h3>
              <p className="text-sm text-zinc-500 mt-1">{faq.a}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
