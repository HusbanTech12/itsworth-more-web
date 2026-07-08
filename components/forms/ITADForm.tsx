"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

interface ITADFormProps {
  onSuccess?: () => void;
}

export function ITADForm({ onSuccess }: ITADFormProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    deviceCount: "",
    comments: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    await fetch("/api/itad-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, fileName: file?.name }),
    });

    setSubmitting(false);
    setStep("success");
    onSuccess?.();
  }

  if (step === "success") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-zinc-900">Request Submitted</h3>
        <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
          Our ITAD team will contact you within 24 hours to discuss your enterprise asset recovery needs.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
        />
        <Input
          label="Company Name"
          placeholder="Acme Corp"
          value={form.companyName}
          onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="john@company.com"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
        />
        <Input
          label="Phone"
          type="tel"
          placeholder="(555) 123-4567"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          required
        />
        <Input
          label="Approximate Device Count"
          type="number"
          min="1"
          placeholder="100"
          value={form.deviceCount}
          onChange={(e) => setForm((p) => ({ ...p, deviceCount: e.target.value }))}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-zinc-900">Upload Inventory (Optional)</h2>
        <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-white px-6 py-6 cursor-pointer hover:border-primary transition-colors">
          <svg className="w-8 h-8 text-zinc-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {file ? (
            <p className="text-sm text-primary font-medium">{file.name}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-zinc-600">Upload spreadsheet</p>
              <p className="text-xs text-zinc-400 mt-1">.xls, .xlsx, .csv, .pdf up to 5MB</p>
            </>
          )}
          <input
            type="file"
            accept=".xls,.xlsx,.csv,.pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <Textarea
        label="Details & Requirements"
        placeholder="Describe your needs — device types, quantities, data destruction requirements, timeline..."
        value={form.comments}
        onChange={(e) => setForm((p) => ({ ...p, comments: e.target.value }))}
        rows={5}
        required
      />

      <Button variant="primary" size="lg" className="w-full sm:w-auto" loading={submitting} type="submit">
        Submit ITAD Request
      </Button>
    </form>
  );
}
