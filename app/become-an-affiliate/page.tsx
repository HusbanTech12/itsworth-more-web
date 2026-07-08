import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Become an Affiliate | Earn Up to $50 Per Sale | ItsWorthMore",
  description:
    "Join our ShareASale affiliate program and earn up to $50 per sale. 60-day cookie duration, real-time tracking, monthly payouts. Free to join.",
};

const commissionTiers = [
  { range: "Up to $350", rate: "10%", commission: "Up to $35" },
  { range: "$350 – $1,000", rate: "$35 flat", commission: "$35" },
  { range: "Over $1,000", rate: "$50 flat", commission: "$50" },
];

const benefits = [
  {
    title: "60-Day Cookie Duration",
    description: "You earn commissions on sales made within 60 days of a referral.",
  },
  {
    title: "High Conversion Rates",
    description: "Our platform converts well — visitors come to sell, not just browse.",
  },
  {
    title: "Wide Product Range",
    description: "Phones, tablets, laptops, smartwatches, gaming consoles, and more.",
  },
  {
    title: "Real-Time Tracking",
    description: "ShareASale dashboard provides real-time clicks, sales, and commissions.",
  },
  {
    title: "Free to Join",
    description: "No upfront costs or minimum sales requirements.",
  },
  {
    title: "Monthly Payouts",
    description: "Commissions paid monthly via ShareASale.",
  },
];

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Become an Affiliate
          </h1>
          <p className="mt-4 text-lg text-zinc-300 max-w-2xl mx-auto">
            Earn up to $50 per sale by referring customers who sell their used
            electronics. Join our ShareASale-powered affiliate program.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-8">
          Commission Structure
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {commissionTiers.map((tier) => (
            <Card key={tier.range} padding="lg" className="text-center">
              <p className="text-sm text-zinc-500 mb-1">Sale Amount</p>
              <p className="text-lg font-bold text-zinc-900">{tier.range}</p>
              <div className="mt-4 pt-4 border-t border-zinc-100">
                <p className="text-sm text-zinc-500 mb-1">Your Commission</p>
                <p className="text-2xl font-bold text-primary">{tier.commission}</p>
                <p className="text-xs text-zinc-400 mt-1">({tier.rate})</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <Card key={b.title} padding="md" className="text-center">
              <h3 className="font-semibold text-zinc-900">{b.title}</h3>
              <p className="text-sm text-zinc-500 mt-2">{b.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16 text-center">
        <Card padding="lg">
          <h2 className="text-xl font-bold text-zinc-900 mb-3">
            Ready to Start Earning?
          </h2>
          <p className="text-sm text-zinc-500 mb-6 max-w-lg mx-auto">
            Sign up through ShareASale to get your unique affiliate links, banners,
            and real-time reporting dashboard.
          </p>
          <a
            href="https://www.shareasale.com/shareasale.cfm?merchantID=YOUR_MERCHANT_ID"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Join via ShareASale
            </Button>
          </a>
          <p className="text-xs text-zinc-400 mt-3">
            You&apos;ll be redirected to ShareASale to complete registration.
          </p>
        </Card>
      </section>
    </div>
  );
}
