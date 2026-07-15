"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

const subjects = [
  { value: "general", label: "General Inquiry" },
  { value: "order", label: "Order Support" },
  { value: "shipping", label: "Shipping Question" },
  { value: "payment", label: "Payment Issue" },
  { value: "device", label: "Device/Quote Question" },
  { value: "complaint", label: "Complaint" },
  { value: "other", label: "Other" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SupportForm() {
  const [step, setStep] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to send message. Please try again.");
        return;
      }

      setStep("success");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900">Message Sent</h3>
        <p className="text-sm text-zinc-500 mt-2">
          We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        placeholder="John Doe"
        value={form.name}
        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        value={form.email}
        onChange={(e) => {
          setForm((p) => ({ ...p, email: e.target.value }));
          if (emailError) setEmailError("");
        }}
        error={emailError}
        required
      />
      <Select
        label="Subject"
        value={form.subject}
        onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
        options={subjects}
        placeholder="Select a subject"
        required
      />
      <Textarea
        label="Message"
        placeholder="How can we help?"
        value={form.message}
        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
        rows={5}
        required
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <Button variant="primary" size="lg" className="w-full" loading={submitting} type="submit">
        Send Message
      </Button>
    </form>
  );
}
