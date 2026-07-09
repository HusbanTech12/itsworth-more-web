import type { Metadata } from "next";
import { SupportForm } from "@/components/forms/SupportForm";

export const metadata: Metadata = {
  title: "Contact Us | ItsWorthMore",
  description: "Get in touch with the ItsWorthMore team. We're here to help with any questions about selling your used electronics.",
};

const contactInfo = [
  { label: "Phone", value: "+1 (855) 487-9678", href: "tel:+18554879678" },
  { label: "SMS", value: "+1 (888) 965-2195", href: "sms:+18889652195" },
  { label: "Email", value: "support@itsworthmore.com", href: "mailto:support@itsworthmore.com" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-white text-zinc-900 py-12 lg:py-16 overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Get in Touch</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-none tracking-tight">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-zinc-500 max-w-xl mx-auto">
            We&apos;d love to hear from you. Reach out and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm">
                <h3 className="font-semibold text-zinc-900 mb-1">Address</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  ItsWorthMore.com LLC<br />
                  570 Monroe Rd<br />
                  Ste 1008<br />
                  Sanford FL 32771
                </p>
              </div>

              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block bg-white rounded-xl p-6 border border-zinc-200 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-zinc-900 group-hover:text-primary transition-colors">{item.value}</p>
                  <p className="text-xs text-zinc-400 mt-1">M - F (8AM - 6PM EST)</p>
                </a>
              ))}
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl p-8 border border-zinc-200 shadow-sm">
                <h3 className="text-xl font-semibold text-zinc-900 mb-6">Send us a message</h3>
                <SupportForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
