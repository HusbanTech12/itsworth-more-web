import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { ITADForm } from "@/components/forms/ITADForm";

export const metadata: Metadata = {
  title: "IT Asset Disposition | Enterprise Asset Recovery | CashingTech",
  description:
    "Enterprise-grade IT asset recovery with secure NIST data destruction, environmental compliance, and maximum value recovery for your business.",
};

const features = [
  {
    title: "Enterprise Asset Recovery",
    description: "Maximize ROI on retired IT assets with our comprehensive recovery program.",
  },
  {
    title: "Secure Data Destruction",
    description: "NIST 800-88 compliant data sanitization with certificates of destruction.",
  },
  {
    title: "Environmentally Responsible",
    description: "R2/RIOS certified recycling. Zero landfill policy on all processed assets.",
  },
  {
    title: "Global Logistics",
    description: "We handle pickup, packing, and shipping for enterprise-scale deployments.",
  },
  {
    title: "Custom Reporting",
    description: "Detailed audit trails, asset reports, and compliance documentation provided.",
  },
  {
    title: "Flexible Payment Terms",
    description: "Net 30, revenue share, or upfront pricing. Choose what works for your business.",
  },
];

const stats = [
  { value: "10K+", label: "Enterprise assets processed" },
  { value: "99.9%", label: "Data destruction rate" },
  { value: "0%", label: "Landfill policy" },
  { value: "24h", label: "Average response time" },
];

export default function ITADPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="relative overflow-hidden bg-ink text-white py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lime mb-4">IT Asset Disposition</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Enterprise{" "}
            <span className="text-lime">
              Asset Recovery
            </span>
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Enterprise-grade IT asset recovery with secure data destruction, environmental compliance, and maximum value recovery.
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-3">What We Offer</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink font-heading">
              Comprehensive ITAD solutions
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card
                key={f.title}
                padding="lg"
                className="text-center hover:shadow-lg hover:-translate-y-0.5 hover:border-orange/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <h3 className="font-semibold text-ink">{f.title}</h3>
                <p className="text-sm text-ink-muted mt-2 leading-relaxed">{f.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-3">Get Started</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink font-heading">
              Contact Our ITAD Team
            </h2>
            <p className="mt-3 text-ink-muted">
              Fill out the form below and a dedicated ITAD specialist will reach out within 24 hours.
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Card padding="lg" className="shadow-md border-border">
              <ITADForm />
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink font-heading">
            Have a bulk quantity of devices?
          </h2>
          <p className="mt-3 text-ink-muted">
            Our bulk trade-in program offers premium pricing for quantities of 20+ devices.
          </p>
          <div className="mt-8">
            <a
              href="/bulk-trade-in"
              className="inline-flex items-center px-6 py-3 rounded-md bg-orange text-white font-medium hover:brightness-110 hover:shadow-lg hover:shadow-orange/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Explore bulk program
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
