import type { Metadata } from "next";
import { SupportForm } from "@/components/forms/SupportForm";

export const metadata: Metadata = {
  title: "Contact Us | CashingTech",
  description: "Get in touch with the CashingTech team. We're here to help with any questions about selling your used electronics.",
};

const contactInfo = [
  { label: "Phone", value: "+1 (855) 487-9678", href: "tel:+18554879678" },
  { label: "SMS", value: "+1 (888) 965-2195", href: "sms:+18889652195" },
  { label: "Email", value: "support@cashingtech.com", href: "mailto:support@cashingtech.com" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="bg-cream text-zinc-900 py-12 lg:py-16 overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-4">Get in Touch</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading leading-tight text-ink">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-ink-muted max-w-xl mx-auto">
            We&apos;d love to hear from you. Reach out and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
                <h3 className="font-semibold text-ink mb-1">Address</h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  CashingTech.com LLC<br />
                  570 Monroe Rd<br />
                  Ste 1008<br />
                  Sanford FL 32771
                </p>
              </div>

              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-orange/30 transition-all duration-300 group"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-orange mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-ink group-hover:text-orange transition-colors">{item.value}</p>
                  <p className="text-xs text-ink-muted mt-1">M - F (8AM - 6PM EST)</p>
                </a>
              ))}
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl p-8 border border-border shadow-sm">
                <h3 className="text-xl font-semibold text-ink mb-6">Send us a message</h3>
                <SupportForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
