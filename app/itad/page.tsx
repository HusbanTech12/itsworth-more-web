import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { ITADForm } from "@/components/forms/ITADForm";

export const metadata: Metadata = {
  title: "IT Asset Disposition | Enterprise Asset Recovery | ItsWorthMore",
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

export default function ITADPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            IT Asset Disposition
          </h1>
          <p className="mt-4 text-lg text-zinc-300 max-w-2xl mx-auto">
            Enterprise-grade IT asset recovery with secure data destruction,
            environmental compliance, and maximum value recovery.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} padding="md" className="text-center">
              <h3 className="font-semibold text-zinc-900">{f.title}</h3>
              <p className="text-sm text-zinc-500 mt-2">{f.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16">
        <Card padding="lg">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">Contact Our ITAD Team</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Fill out the form below and a dedicated ITAD specialist will reach out within 24 hours.
          </p>
          <ITADForm />
        </Card>
      </section>
    </div>
  );
}
