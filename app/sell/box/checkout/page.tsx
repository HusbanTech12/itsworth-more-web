"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { CarrierSelector } from "@/components/checkout/CarrierSelector";
import { PaymentSelector } from "@/components/checkout/PaymentSelector";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useBox } from "@/context/BoxContext";

interface ShippingData {
  name: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

type CheckoutStep = "details" | "confirm";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalCents, discountCents, totalCents, clearBox } = useBox();
  const [step, setStep] = useState<CheckoutStep>("details");
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [shippingSpeed, setShippingSpeed] = useState<"standard" | "expedited">("standard");

  const [shipping, setShipping] = useState<ShippingData>({
    name: "",
    street: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    phone: "",
  });

  const [carrier, setCarrier] = useState<"fedex" | "ups">("fedex");
  const [paymentMethod, setPaymentMethod] = useState<"check" | "paypal" | "zelle">("paypal");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingData, string>>>({});
  const [submitError, setSubmitError] = useState("");

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!shipping.name.trim()) newErrors.name = "Required";
    if (!shipping.street.trim()) newErrors.street = "Required";
    if (!shipping.city.trim()) newErrors.city = "Required";
    if (!shipping.state) newErrors.state = "Required";
    if (!shipping.zip.trim()) newErrors.zip = "Required";
    if (!shipping.country) newErrors.country = "Required";
    if (!shipping.phone.trim()) newErrors.phone = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!consent) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          subtotalCents,
          discountCents,
          totalCents,
          shipping,
          carrier,
          shippingMethod: shippingSpeed,
          paymentMethod,
          paymentEmail,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || "Checkout failed. Please try again.");
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      clearBox();
      router.push(`/dashboard/orders/${data.offerNumber}`);
    } catch {
      setSubmitError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg className="w-16 h-16 mx-auto text-ink-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h2 className="text-xl font-semibold text-ink mb-2">Your Box is empty</h2>
          <p className="text-ink-muted mb-6">Add some items before checking out.</p>
          <Link href="/sell">
            <Button variant="primary" size="lg">Start Selling</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-8">Checkout</h1>

        {step === "details" ? (
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <Card padding="lg">
                <ShippingForm data={shipping} onChange={setShipping} errors={errors} />
              </Card>

              <Card padding="lg">
                <CarrierSelector value={carrier} onChange={setCarrier} />
              </Card>

              <Card padding="lg" className="space-y-4">
                <h2 className="text-lg font-semibold text-ink">Shipping Speed</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setShippingSpeed("standard")}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                      shippingSpeed === "standard"
                        ? "border-orange bg-orange/5 shadow-sm"
                        : "border-border hover:border-border bg-white"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      shippingSpeed === "standard" ? "border-orange" : "border-border"
                    }`}>
                      {shippingSpeed === "standard" && <div className="w-2.5 h-2.5 rounded-full bg-orange" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Standard</p>
                      <p className="text-xs text-ink-muted">Free · 5-7 business days</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setShippingSpeed("expedited")}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                      shippingSpeed === "expedited"
                        ? "border-orange bg-orange/5 shadow-sm"
                        : "border-border hover:border-border bg-white"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      shippingSpeed === "expedited" ? "border-orange" : "border-border"
                    }`}>
                      {shippingSpeed === "expedited" && <div className="w-2.5 h-2.5 rounded-full bg-orange" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Expedited</p>
                      <p className="text-xs text-ink-muted">2-day shipping · 1-day processing</p>
                    </div>
                  </button>
                </div>
              </Card>

              <Card padding="lg">
                <PaymentSelector
                  method={paymentMethod}
                  onChange={setPaymentMethod}
                  email={paymentEmail}
                  onEmailChange={setPaymentEmail}
                />
              </Card>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <OrderSummary
                  items={items}
                  subtotalCents={subtotalCents}
                  discountCents={discountCents}
                  totalCents={totalCents}
                  shippingMethod={shippingSpeed}
                  carrier={carrier}
                />

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    if (validate()) setStep("confirm");
                  }}
                >
                  Review Order
                </Button>

                <Link href="/sell/box">
                  <Button variant="outline" size="md" className="w-full">
                    Back to Box
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-lime/10 border border-lime/20 rounded-xl p-6 text-center">
              <svg className="w-12 h-12 mx-auto text-lime mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-bold text-ink">Review Your Order</h2>
              <p className="text-sm text-ink-muted mt-1">
                Please confirm all details before submitting.
              </p>
            </div>

            <Card padding="lg" className="space-y-4">
              <h3 className="font-semibold text-ink">Shipping To</h3>
              <div className="text-sm text-ink-muted space-y-0.5">
                <p>{shipping.name}</p>
                <p>{shipping.street}{shipping.street2 ? `, ${shipping.street2}` : ""}</p>
                <p>{shipping.city}, {shipping.state} {shipping.zip}</p>
                <p>{shipping.country}</p>
                <p>{shipping.phone}</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm"><span className="font-medium text-ink">Carrier:</span> <span className="text-ink-muted capitalize">{carrier}</span></p>
                <p className="text-sm"><span className="font-medium text-ink">Speed:</span> <span className="text-ink-muted capitalize">{shippingSpeed}</span></p>
                <p className="text-sm"><span className="font-medium text-ink">Payment:</span> <span className="text-ink-muted capitalize">{paymentMethod}</span></p>
                {(paymentMethod === "paypal" || paymentMethod === "zelle") && (
                  <p className="text-sm"><span className="font-medium text-ink">Email:</span> <span className="text-ink-muted">{paymentEmail}</span></p>
                )}
              </div>
            </Card>

            <OrderSummary
              items={items}
              subtotalCents={subtotalCents}
              discountCents={discountCents}
              totalCents={totalCents}
              shippingMethod={shippingSpeed}
              carrier={carrier}
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border text-orange focus:ring-orange/50"
              />
              <span className="text-sm text-ink-muted">
                I confirm that the device details and condition I provided are accurate. I understand
                that the final offer may be adjusted after inspection and agree to the{" "}
                <a href="/terms-and-conditions" className="text-orange underline">Terms & Conditions</a>.
              </span>
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={!consent}
                loading={submitting}
                onClick={handleSubmit}
              >
                Submit Order
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep("details")}
                disabled={submitting}
              >
                Edit Details
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
