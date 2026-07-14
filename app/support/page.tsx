import type { Metadata } from "next";
import { Accordion } from "@/components/ui/Accordion";
import { Card } from "@/components/ui/Card";
import { SupportForm } from "@/components/forms/SupportForm";

export const metadata: Metadata = {
  title: "Support & FAQs | CashingTech",
  description: "Find answers about selling your used electronics, shipping, payment, and more. Contact our support team for assistance.",
};

const faqSections = [
  {
    category: "Selling Your Device",
    items: [
      {
        title: "How does selling my device on CashingTech work?",
        content: "Easy. You tell us what you've got, we tell you what it's worth. If you like the offer, you ship it for free, and we send you cash. No mystery. No waiting around.",
      },
      {
        title: "What types of devices do you accept?",
        content: "If it's got a screen and a resale value, chances are we take it. Phones, tablets, laptops, smartwatches — you name it. Check our site to see if yours is on the list.",
      },
      {
        title: "How do I know if my device qualifies?",
        content: "If it turns on, has no major damage, and isn't haunted, you're probably good. But even if it's a little worse for wear, we'll still take a look. Just be honest about its condition.",
      },
      {
        title: "Do you accept devices from outside the United States?",
        content: "Not yet. For now, we only buy devices from within the U.S. If that changes, we'll let the world know. Until then, hang tight (or find a friend stateside).",
      },
      {
        title: "Is there a limit to how many items I can sell?",
        content: "Nope. Sell as many as you want. But if you're offloading 10 or more devices, give us a heads-up first. Bulk sales need final approval, and in rare cases, we may have to cancel an order if needed. Reach out to us before creating your offer.",
      },
      {
        title: "What do I do with my SIM card?",
        content: "Take it out before you ship. Forgot? No panic — we toss SIM cards as part of our wipe process. We don't read them, store them, or hand them off anywhere.",
      },
      {
        title: "What if I'm not sure which model I have?",
        content: "Pop into Settings → About on your device — the model number lives there. Still stuck? Your old carrier can usually tell you. We just need to know what we're looking at.",
      },
      {
        title: "Do I need to send my accessories?",
        content: "Only what you tick at checkout. If you select headphones, send headphones. If you don't, no problem — leave them in the drawer. One exception: items in \"New\" condition. Those need to come with all the original accessories. We pay a premium for new, so we expect the full kit.",
      },
    ],
  },
  {
    category: "Pricing & Offers",
    items: [
      {
        title: "How is my device's value determined?",
        content: "We look at a few things: the model, its condition, and how much demand there is for it. Newer devices in great shape? Worth more. A little rough around the edges? We'll still make you a fair offer. Here's how it works: We check the model. If what you send matches what you selected, we're off to a good start. We inspect the condition. Scratches, dents, water damage — we note it all. We verify authenticity. No counterfeits, no tampering. We test the battery. If it holds a solid charge, that's a plus. We clear all data. Passwords removed, personal info wiped, device reset. If everything checks out, you get paid. If there's a mismatch, we'll send you a revised offer. If you don't like it, we'll send your device back for free.",
      },
      {
        title: "How long is my quote valid?",
        content: "Your quote is locked in for 21 days. If your device arrives after that, we'll re-evaluate it based on the current market value. Prices change, so don't wait too long!",
      },
      {
        title: "What happens if my device's condition doesn't match my quote?",
        content: "If we find it's a little more \"well-loved\" than expected, we'll send you a revised offer. You've got 3 days to take it or leave it. Don't like it? No problem — we'll ship your device back for free, no strings attached. Skip the reply and we'll assume the new number works for you and process payment.",
      },
      {
        title: "What happens if I'm not happy with my final offer?",
        content: "No hard feelings. If we adjust the offer and you're not into it, we'll ship your device back to you for free. No hassle, no guilt trip, just your tech returning home.",
      },
      {
        title: "What does \"unlocked\" mean and why does it matter?",
        content: "Unlocked means your phone isn't tied to a single carrier. And yes — unlocked phones are worth more. Not sure? Most carriers will unlock a phone for you on request, especially if it's paid off. Quick call, bigger payout.",
      },
      {
        title: "What if I disagree with the evaluation?",
        content: "Ask for a reinspection. A second set of eyes takes another look — and if they disagree with the first read, your offer goes up. If you'd rather just have your device back, that's free too.",
      },
    ],
  },
  {
    category: "Shipping & Returns",
    items: [
      {
        title: "Is shipping really free?",
        content: "Yes! We'll send you a prepaid, trackable shipping label, so you don't have to spend a dime. Just print, pack, and send. Really, that's it.",
      },
      {
        title: "How do I ship my device?",
        content: "Find a box. Put your device in it. Slap on the prepaid label. Drop it off at either FedEx or UPS, whoever you selected at the checkout process. Done.",
      },
      {
        title: "How do I track my package?",
        content: "We'll provide you a prepaid, trackable shipping label via FedEx or UPS. Just slap it on the box and drop it off. You'll get a delivery confirmation so you know when it reaches us, plus we'll email you as soon as it arrives.",
      },
      {
        title: "Is my package insured? What if it gets damaged?",
        content: "Yep, we've got you covered up to $100 with our standard insurance. Need more? You can upgrade at checkout for full coverage. Pack your device securely and we'll take care of the rest.",
      },
      {
        title: "Is there a faster way to ship?",
        content: "Yes — pick our 2-day expedited shipping at checkout. Pair it with PayPal, Zelle, or Direct Deposit and you'll have cash in hand the very next business day.",
      },
      {
        title: "What if I don't have a printer?",
        content: "No printer, no problem. Email, chat, or call us with your offer number and we'll mail you a label via USPS. Slightly slower, just as free.",
      },
    ],
  },
  {
    category: "Payments & Processing",
    items: [
      {
        title: "How and when will I get paid?",
        content: "We pay your way — choose Check, PayPal, or Zelle when you check out. Once your device lands at our place, we'll inspect it, and as soon as it's approved, your cash is on the way, processed within 24-48 hours.",
      },
      {
        title: "Is there a faster way to get paid?",
        content: "Yes. Choose the expedited option with PayPal or Zelle, and we'll inspect your device in 1 business day and pay you the next. Fast, simple, no waiting around.",
      },
      {
        title: "What if my payment hasn't arrived?",
        content: "Once your offer is approved, payment goes out within 24-48 hours and you'll get an email with a confirmation number. Past that window? Check your spam folder, then your chosen payment method. Still nothing? Hit us up and we'll trace it.",
      },
      {
        title: "What if I picked the wrong payment method?",
        content: "Email us with your offer number and we'll update it on the back end. The change shows up under the \"Adjustment\" notes on your offer page.",
      },
    ],
  },
  {
    category: "Security & Trust",
    items: [
      {
        title: "Do I need to remove my personal data before sending my device?",
        content: "We wipe every device clean, no exceptions. But for extra peace of mind, do a factory reset before you ship it.",
      },
      {
        title: "Is selling to CashingTech safe?",
        content: "Sending off your device can feel like a leap of faith. We get that. That's why at CashingTech, we do things right every time. We've built this business on fair prices, secure transactions, and fast payments. 500,000+ happy sellers and top ratings on Google, BBB, Trustpilot, and ResellerRatings say it's safe.",
      },
      {
        title: "Do you share my personal information?",
        content: "Nope. Your info stays your info. We don't sell it, share it, or do anything shady with it. Check out our privacy policy if you want the fine print.",
      },
    ],
  },
  {
    category: "Others",
    items: [
      {
        title: "Why should I sign up for an account?",
        content: "Because it makes life easier. Track your offers, keep tabs on any referral commissions, and save your info for faster checkout next time. Less typing, more selling.",
      },
      {
        title: "I haven't received my confirmation email. What now?",
        content: "Check your spam folder first — that's where most of them hide. Add CashingTech.com to your safe-senders list. Still missing? Reach out and we'll resend.",
      },
    ],
  },
];

const contactInfo = [
  { label: "Phone", value: "+1 (855) 487-9678", href: "tel:+18554879678" },
  { label: "SMS", value: "+1 (888) 965-2195", href: "sms:+18889652195" },
  { label: "Email", value: "support@cashingtech.com", href: "mailto:support@cashingtech.com" },
];

const quickStats = [
  { end: "24h", label: "Average response time" },
  { end: "50K+", label: "Support tickets resolved" },
  { end: "98%", label: "Satisfaction rating" },
  { end: "500K+", label: "Sellers supported" },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="relative overflow-hidden bg-cream py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-4">Help Center</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading leading-tight text-ink">
            Support &amp;{" "}
            <span className="text-orange">
              FAQs
            </span>
          </h1>
          <p className="mt-4 text-lg text-ink-muted max-w-xl mx-auto">
            All the questions you wanted answered. If you still need help, our team is here for you.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {quickStats.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-6 text-center border border-border shadow-sm hover:shadow-lg hover:border-orange/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <p className="text-2xl sm:text-3xl font-bold text-orange">{stat.end}</p>
                <p className="mt-1 text-sm text-ink-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {faqSections.map((section, i) => (
            <div key={section.category} className="mb-14 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <h2 className="text-2xl font-bold text-ink mb-6 font-heading">
                {section.category}
              </h2>
              <Accordion items={section.items} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-3">Get in Touch</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink font-heading">
              Still have questions?
            </h2>
            <p className="mt-3 text-ink-muted max-w-lg mx-auto">
              Our support team is available Monday through Friday, 8AM to 6PM EST.
            </p>
          </div>
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-4 animate-slide-up">
              <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
                <h3 className="font-semibold text-ink mb-1">Mailing Address</h3>
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
            <div className="lg:col-span-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="bg-white rounded-xl p-8 border border-border shadow-sm">
                <h3 className="text-xl font-semibold text-ink mb-6">Send us a message</h3>
                <SupportForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink font-heading">
            Ready to sell your device?
          </h2>
          <p className="mt-3 text-ink-muted">
            Get your instant quote in under 60 seconds. No obligations, no hassle.
          </p>
          <div className="mt-8">
            <a
              href="/sell"
              className="inline-flex items-center px-6 py-3 rounded-md bg-orange text-white font-medium hover:brightness-110 hover:shadow-lg hover:shadow-orange/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Start selling
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
