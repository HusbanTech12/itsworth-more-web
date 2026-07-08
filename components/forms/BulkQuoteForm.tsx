"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

interface ItemRow {
  id: string;
  productName: string;
  quantity: string;
  condition: string;
  category: string;
  specs: string;
}

const categories = [
  { value: "phone", label: "Mobile Phones" },
  { value: "tablet", label: "Tablets" },
  { value: "laptop", label: "Laptops" },
  { value: "desktop", label: "Desktops" },
  { value: "monitor", label: "Monitors" },
  { value: "game-console", label: "Game Consoles" },
  { value: "camera", label: "Cameras" },
  { value: "audio", label: "Audio" },
  { value: "smart-watch", label: "Smartwatches" },
  { value: "vr", label: "VR Headsets" },
  { value: "networking", label: "Networking Equipment" },
  { value: "other", label: "Other" },
];

const conditions = [
  { value: "brand-new", label: "Brand New" },
  { value: "flawless", label: "Flawless" },
  { value: "very-good", label: "Very Good" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "broken", label: "Broken" },
];

interface BulkQuoteFormProps {
  onSuccess?: () => void;
}

export function BulkQuoteForm({ onSuccess }: BulkQuoteFormProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [contact, setContact] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    comments: "",
  });

  const [items, setItems] = useState<ItemRow[]>([
    { id: "1", productName: "", quantity: "1", condition: "", category: "", specs: "" },
  ]);

  function addRow() {
    const id = `item_${Date.now()}`;
    setItems((prev) => [...prev, { id, productName: "", quantity: "1", condition: "", category: "", specs: "" }]);
  }

  function removeRow(id: string) {
    setItems((prev) => prev.filter((r) => r.id !== id));
  }

  function updateRow(id: string, field: keyof ItemRow, value: string) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    await fetch("/api/bulk-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact, items, fileName: file?.name }),
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
        <h3 className="text-xl font-semibold text-zinc-900">Quote Request Submitted</h3>
        <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
          Thanks for your interest. A dedicated relationship manager will reach out within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">Contact Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={contact.name}
            onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <Input
            label="Company Name"
            placeholder="Acme Corp"
            value={contact.companyName}
            onChange={(e) => setContact((p) => ({ ...p, companyName: e.target.value }))}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@company.com"
            value={contact.email}
            onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
            required
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={contact.phone}
            onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Device List</h2>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            + Add Row
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-zinc-500">Item {i + 1}</span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(item.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <Input
                  placeholder="Product name"
                  value={item.productName}
                  onChange={(e) => updateRow(item.id, "productName", e.target.value)}
                  required
                />
                <Input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateRow(item.id, "quantity", e.target.value)}
                  required
                />
                <Select
                  placeholder="Condition"
                  value={item.condition}
                  onChange={(e) => updateRow(item.id, "condition", e.target.value)}
                  options={conditions}
                  required
                />
                <Select
                  placeholder="Category"
                  value={item.category}
                  onChange={(e) => updateRow(item.id, "category", e.target.value)}
                  options={categories}
                  required
                />
                <Input
                  placeholder="Specs (optional)"
                  value={item.specs}
                  onChange={(e) => updateRow(item.id, "specs", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-zinc-400">
          Have a spreadsheet? Upload it below instead of (or in addition to) listing items manually.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">Spreadsheet Upload (Optional)</h2>
        <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-white px-6 py-8 cursor-pointer hover:border-primary transition-colors">
          <svg className="w-10 h-10 text-zinc-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {file ? (
            <p className="text-sm text-primary font-medium">{file.name}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-zinc-600">Click to upload spreadsheet</p>
              <p className="text-xs text-zinc-400 mt-1">.xls, .xlsx, .csv up to 5MB</p>
            </>
          )}
          <input
            type="file"
            accept=".xls,.xlsx,.csv"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <div className="space-y-4">
        <Textarea
          label="Additional Comments"
          placeholder="Any additional details about your devices..."
          value={contact.comments}
          onChange={(e) => setContact((p) => ({ ...p, comments: e.target.value }))}
          rows={4}
        />
      </div>

      <Button variant="primary" size="lg" className="w-full sm:w-auto" loading={submitting} type="submit">
        Submit Quote Request
      </Button>
    </form>
  );
}
