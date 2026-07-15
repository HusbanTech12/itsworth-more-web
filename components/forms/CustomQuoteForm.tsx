"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

const categories = [
  { value: "phone", label: "Mobile Phone" },
  { value: "tablet", label: "Tablet" },
  { value: "laptop", label: "Laptop" },
  { value: "desktop", label: "Desktop" },
  { value: "monitor", label: "Monitor" },
  { value: "game-console", label: "Game Console" },
  { value: "camera", label: "Camera" },
  { value: "audio", label: "Audio Equipment" },
  { value: "smart-watch", label: "Smartwatch" },
  { value: "vr", label: "VR Headset" },
  { value: "networking", label: "Networking Equipment" },
  { value: "other", label: "Other" },
];

const conditions = [
  { value: "brand-new", label: "Brand New" },
  { value: "flawless", label: "Flawless" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "broken", label: "Broken" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormData {
  name: string;
  email: string;
  phone: string;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
  condition: string;
  quantity: string;
  notes: string;
}

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  deviceType: "",
  deviceBrand: "",
  deviceModel: "",
  condition: "",
  quantity: "1",
  notes: "",
};

export function CustomQuoteForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!EMAIL_REGEX.test(form.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/bulk-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          comments: form.notes,
          items: [
            {
              productName: `${form.deviceBrand} ${form.deviceModel}`.trim(),
              quantity: parseInt(form.quantity) || 1,
              conditionSlug: form.condition,
              category: form.deviceType,
              specs: `Brand: ${form.deviceBrand}, Model: ${form.deviceModel}`,
            },
          ],
          type: "bulk",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to submit quote request. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Quote Request Received!</h2>
        <p className="text-zinc-500 max-w-md mx-auto">
          Thanks, {form.name}! Our team will review your device and get back to you within 24 hours with a custom quote.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-zinc-200 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900 mb-6">Your Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => {
              update("email", e.target.value);
              if (emailError) setEmailError("");
            }}
            error={emailError}
            required
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="sm:col-span-2"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 border border-zinc-200 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900 mb-6">Device Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="Device Type"
            options={categories}
            value={form.deviceType}
            placeholder="Select type"
            onChange={(e) => update("deviceType", e.target.value)}
            required
          />
          <Input
            label="Brand"
            placeholder="e.g. Sony, Canon, Dell"
            value={form.deviceBrand}
            onChange={(e) => update("deviceBrand", e.target.value)}
            required
          />
          <Input
            label="Model"
            placeholder="e.g. WH-1000XM5, EOS R5"
            value={form.deviceModel}
            onChange={(e) => update("deviceModel", e.target.value)}
            required
          />
          <Select
            label="Condition"
            options={conditions}
            value={form.condition}
            placeholder="Select condition"
            onChange={(e) => update("condition", e.target.value)}
            required
          />
          <Input
            label="Quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            required
          />
        </div>
        <div className="mt-4">
          <Textarea
            label="Additional Notes"
            placeholder="Any additional details about the device, accessories included, or special requests..."
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={4}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" loading={submitting}>
        Submit Quote Request
      </Button>
    </form>
  );
}
