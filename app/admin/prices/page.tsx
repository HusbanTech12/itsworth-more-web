"use client";

import { useState, useEffect } from "react";
import { Modal } from "../_components/Modal";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";

interface Device {
  id: number;
  name: string;
}

interface Price {
  id: number;
  deviceId: number;
  conditionSlug: string;
  priceCents: number;
  isActive: boolean;
}

const emptyForm = {
  deviceId: 0,
  conditionSlug: "",
  priceCents: 0,
  isActive: true,
};

const conditionOptions = [
  "brand-new",
  "flawless",
  "very-good",
  "good",
  "fair",
  "broken",
];

export default function AdminPricesPage() {
  const [items, setItems] = useState<Price[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Price | null>(null);
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
    Promise.all([fetchItems(), fetchDevices()]);
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/prices");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.prices ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function fetchDevices() {
    try {
      const res = await fetch("/api/admin/devices");
      const data = await res.json();
      setDevices(Array.isArray(data) ? data : data.devices ?? []);
    } catch {
      // ignore
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(item: Price) {
    setEditing(item);
    setForm({
      deviceId: item.deviceId,
      conditionSlug: item.conditionSlug,
      priceCents: item.priceCents,
      isActive: item.isActive,
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/prices/${editing.id}` : "/api/admin/prices";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      setToast({ open: true, message: editing ? "Price updated" : "Price created", variant: "success" });
      setShowForm(false);
      fetchItems();
    } catch {
      setToast({ open: true, message: "Failed to save price", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this price?")) return;
    try {
      const res = await fetch(`/api/admin/prices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setToast({ open: true, message: "Price deleted", variant: "success" });
      fetchItems();
    } catch {
      setToast({ open: true, message: "Failed to delete price", variant: "error" });
    }
  }

  function getDeviceName(id: number) {
    return devices.find((d) => d.id === id)?.name ?? `Device #${id}`;
  }

  function formatCents(cents: number) {
    return "$" + (cents / 100).toFixed(2);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = items.filter(item => {
    const deviceName = getDeviceName(item.deviceId);
    const matchesSearch = !search || deviceName.toLowerCase().includes(search.toLowerCase()) || item.conditionSlug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? item.isActive : !item.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Device Prices</h1>
        <Button onClick={openCreate}>Add Price</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          placeholder="Search by device or condition..."
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
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Device</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Condition</th>
                <th className="text-right px-4 py-3 font-medium text-ink-muted">Price</th>
                <th className="text-center px-4 py-3 font-medium text-ink-muted">Active</th>
                <th className="text-right px-4 py-3 font-medium text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                    No prices found
                  </td>
                </tr>
              ) : (
                filtered.map((item, i) => (
                  <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-cream/50"}>
                    <td className="px-4 py-3 text-ink-muted">{item.id}</td>
                    <td className="px-4 py-3 text-ink">{getDeviceName(item.deviceId)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-cream text-ink-muted text-xs font-medium">
                        {item.conditionSlug}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">{formatCents(item.priceCents)}</td>
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

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? "Edit Price" : "Add Price"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Device</label>
            <select
              value={form.deviceId}
              onChange={(e) => setForm({ ...form, deviceId: parseInt(e.target.value) })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            >
              <option value={0} disabled>Select device</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Condition</label>
            <select
              value={form.conditionSlug}
              onChange={(e) => setForm({ ...form, conditionSlug: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            >
              <option value="" disabled>Select condition</option>
              {conditionOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Price (cents)</label>
            <input
              type="number"
              value={form.priceCents}
              onChange={(e) => setForm({ ...form, priceCents: parseInt(e.target.value) || 0 })}
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
