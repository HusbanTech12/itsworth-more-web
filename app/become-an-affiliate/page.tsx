import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Become an Affiliate | Earn Up to $50 Per Sale | CashingTech",
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

const stats = [
  { value: "10%", label: "Commission on first $350" },
  { value: "$50", label: "Max commission per sale" },
  { value: "60", label: "Day cookie window" },
  { value: "Monthly", label: "Payout frequency" },
];

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="relative overflow-hidden bg-ink text-white py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lime mb-4">Affiliate Program</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Earn up to{" "}
            <span className="text-lime">
              $50 per sale
            </span>
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Join our ShareASale-powered affiliate program and earn commissions by referring customers who sell their used electronics.
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
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-3">Commission Structure</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-10 font-heading">
            The more you refer, the more you earn
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 lg:gap-6">
            {commissionTiers.map((tier, i) => (
              <Card
                key={tier.range}
                padding="lg"
                className={`text-center animate-fade-in ${i === 1 ? "border-orange/40 shadow-md" : ""}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <p className="text-sm text-ink-muted mb-1">Sale Amount</p>
                <p className="text-lg font-bold text-ink">{tier.range}</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-ink-muted mb-1">Your Commission</p>
                  <p className="text-2xl font-bold text-orange">{tier.commission}</p>
                  <p className="text-xs text-ink-muted mt-1">({tier.rate})</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-3">Why Partner With Us</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink font-heading">
              Everything you need to succeed
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <Card
                key={b.title}
                padding="md"
                className="text-center hover:shadow-lg hover:-translate-y-0.5 hover:border-orange/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <h3 className="font-semibold text-ink">{b.title}</h3>
                <p className="text-sm text-ink-muted mt-2">{b.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <Card padding="lg" className="shadow-md border-border">
            <h2 className="text-2xl font-bold text-ink mb-3 font-heading">
              Ready to Start Earning?
            </h2>
            <p className="text-sm text-ink-muted mb-6 max-w-lg mx-auto">
              Sign up through ShareASale to get your unique affiliate links, banners, and real-time reporting dashboard.
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
            <p className="text-xs text-ink-muted mt-3">
              You&apos;ll be redirected to ShareASale to complete registration.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
