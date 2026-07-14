"use client";

import { useState, useEffect } from "react";
import { Modal } from "../_components/Modal";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";

interface Coupon {
  id: number;
  code: string;
  type: string;
  valueCents: number | null;
  percentage: string | null;
  maxApplyCents: number | null;
  maxApplyTotalCents: number | null;
  minOrderCents: number | null;
  maxUses: number | null;
  maxUsesPerUser: number | null;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
}

const emptyForm = {
  code: "",
  type: "percentage",
  valueCents: 0,
  percentage: "",
  maxApplyCents: 0,
  maxApplyTotalCents: 0,
  minOrderCents: 0,
  maxUses: 0,
  maxUsesPerUser: 0,
  isActive: true,
  startsAt: "",
  expiresAt: "",
};

export default function AdminCouponsPage() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState<{ open: boolean; message: string; variant: "success" | "error" }>({
    open: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.coupons ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(item: Coupon) {
    setEditing(item);
    setForm({
      code: item.code,
      type: item.type,
      valueCents: item.valueCents ?? 0,
      percentage: item.percentage ?? "",
      maxApplyCents: item.maxApplyCents ?? 0,
      maxApplyTotalCents: item.maxApplyTotalCents ?? 0,
      minOrderCents: item.minOrderCents ?? 0,
      maxUses: item.maxUses ?? 0,
      maxUsesPerUser: item.maxUsesPerUser ?? 0,
      isActive: item.isActive,
      startsAt: item.startsAt ? item.startsAt.slice(0, 16) : "",
      expiresAt: item.expiresAt ? item.expiresAt.slice(0, 16) : "",
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        percentage: form.percentage ? parseFloat(form.percentage) : null,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      };
      const url = editing ? `/api/admin/coupons/${editing.id}` : "/api/admin/coupons";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      setToast({ open: true, message: editing ? "Coupon updated" : "Coupon created", variant: "success" });
      setShowForm(false);
      fetchItems();
    } catch {
      setToast({ open: true, message: "Failed to save coupon", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setToast({ open: true, message: "Coupon deleted", variant: "success" });
      fetchItems();
    } catch {
      setToast({ open: true, message: "Failed to delete coupon", variant: "error" });
    }
  }

  function formatDate(date: string | null) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
  }

  function formatDiscount(item: Coupon) {
    if (item.type === "percentage" && item.percentage) {
      return `${parseFloat(item.percentage).toFixed(0)}%`;
    }
    if (item.type === "fixed" && item.valueCents) {
      return "$" + (item.valueCents / 100).toFixed(2);
    }
    return "—";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = items.filter(item => {
    const matchesSearch = !search || item.code?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? item.isActive : !item.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Coupons</h1>
        <Button onClick={openCreate}>Add Coupon</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          placeholder="Search by code..."
          onSearch={setSearch}
          className="w-full sm:max-w-xs"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-40"
          options={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-ink-muted">ID</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Code</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Type</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Discount</th>
                <th className="text-right px-4 py-3 font-medium text-ink-muted">Min Order</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Starts</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Expires</th>
                <th className="text-center px-4 py-3 font-medium text-ink-muted">Active</th>
                <th className="text-right px-4 py-3 font-medium text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-ink-muted">
                    No coupons found
                  </td>
                </tr>
              ) : (
                filtered.map((item, i) => (
                  <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-cream/50"}>
                    <td className="px-4 py-3 text-ink-muted">{item.id}</td>
                    <td className="px-4 py-3 font-mono text-sm font-medium text-ink">{item.code}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.type === "percentage" ? "bg-blue-50 text-blue-700" : "bg-violet-50 text-violet-700"
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatDiscount(item)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs">
                      {item.minOrderCents ? "$" + (item.minOrderCents / 100).toFixed(2) : "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-muted text-xs">{formatDate(item.startsAt)}</td>
                    <td className="px-4 py-3 text-ink-muted text-xs">{formatDate(item.expiresAt)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.isActive ? "bg-emerald-50 text-emerald-700" : "bg-cream text-ink-muted"
                      }`}>
                        {item.isActive ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                          <span className="text-red-500">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? "Edit Coupon" : "Add Coupon"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Code</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          {form.type === "fixed" && (
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-1">Value (cents)</label>
              <input
                type="number"
                value={form.valueCents}
                onChange={(e) => setForm({ ...form, valueCents: parseInt(e.target.value) || 0 })}
                className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
              />
            </div>
          )}
          {form.type === "percentage" && (
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-1">Percentage (%)</label>
              <input
                type="number"
                step="0.01"
                value={form.percentage}
                onChange={(e) => setForm({ ...form, percentage: e.target.value })}
                className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Max Apply (cents per item)</label>
            <input
              type="number"
              value={form.maxApplyCents}
              onChange={(e) => setForm({ ...form, maxApplyCents: parseInt(e.target.value) || 0 })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Max Apply Total (cents per order)</label>
            <input
              type="number"
              value={form.maxApplyTotalCents}
              onChange={(e) => setForm({ ...form, maxApplyTotalCents: parseInt(e.target.value) || 0 })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Min Order (cents)</label>
            <input
              type="number"
              value={form.minOrderCents}
              onChange={(e) => setForm({ ...form, minOrderCents: parseInt(e.target.value) || 0 })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Max Uses</label>
            <input
              type="number"
              value={form.maxUses}
              onChange={(e) => setForm({ ...form, maxUses: parseInt(e.target.value) || 0 })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Max Uses Per User</label>
            <input
              type="number"
              value={form.maxUsesPerUser}
              onChange={(e) => setForm({ ...form, maxUsesPerUser: parseInt(e.target.value) || 0 })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded border-border text-orange focus:ring-orange/50"
            />
            <span className="text-sm font-medium text-ink-muted">Active</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Starts At</label>
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Expires At</label>
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? "Update" : "Create"}</Button>
          </div>
        </div>
      </Modal>

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        variant={toast.variant}
      />
    </div>
  );
}
