"use client";

import { useState, useEffect } from "react";
import { Modal } from "../_components/Modal";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";

interface Brand {
  id: number;
  name: string;
}

interface Device {
  id: number;
  name: string;
  slug: string;
  brandId: number;
  imageUrl: string | null;
  maxQuoteCents: number | null;
  sortOrder: number;
  isActive: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
}

const emptyForm = {
  name: "",
  slug: "",
  brandId: 0,
  imageUrl: "",
  maxQuoteCents: 0,
  sortOrder: 0,
  isActive: true,
  metaTitle: "",
  metaDescription: "",
};

export default function AdminDevicesPage() {
  const [items, setItems] = useState<Device[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Device | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [toast, setToast] = useState<{ open: boolean; message: string; variant: "success" | "error" }>({
    open: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    Promise.all([fetchItems(), fetchBrands()]);
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/devices");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.devices ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function fetchBrands() {
    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      setBrands(Array.isArray(data) ? data : data.brands ?? []);
    } catch {
      // ignore
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(item: Device) {
    setEditing(item);
    setForm({
      name: item.name,
      slug: item.slug,
      brandId: item.brandId,
      imageUrl: item.imageUrl ?? "",
      maxQuoteCents: item.maxQuoteCents ?? 0,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
      metaTitle: item.metaTitle ?? "",
      metaDescription: item.metaDescription ?? "",
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/devices/${editing.id}` : "/api/admin/devices";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      setToast({ open: true, message: editing ? "Device updated" : "Device created", variant: "success" });
      setShowForm(false);
      fetchItems();
    } catch {
      setToast({ open: true, message: "Failed to save device", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this device?")) return;
    try {
      const res = await fetch(`/api/admin/devices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setToast({ open: true, message: "Device deleted", variant: "success" });
      fetchItems();
    } catch {
      setToast({ open: true, message: "Failed to delete device", variant: "error" });
    }
  }

  function getBrandName(id: number) {
    return brands.find((b) => b.id === id)?.name ?? `Brand #${id}`;
  }

  function formatCents(cents: number | null) {
    if (cents === null || cents === 0) return "—";
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
    const matchesSearch = !search || item.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? item.isActive : !item.isActive);
    const matchesBrand = brandFilter === "all" || item.brandId === parseInt(brandFilter);
    return matchesSearch && matchesStatus && matchesBrand;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Devices</h1>
        <Button onClick={openCreate}>Add Device</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          placeholder="Search by name..."
          onSearch={setSearch}
          className="w-full sm:max-w-xs"
        />
        <Select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="w-full sm:w-44"
          options={[
            { value: "all", label: "All Brands" },
            ...brands.map((b) => ({ value: String(b.id), label: b.name })),
          ]}
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
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Name</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Brand</th>
                <th className="text-right px-4 py-3 font-medium text-ink-muted">Max Quote</th>
                <th className="text-center px-4 py-3 font-medium text-ink-muted">Sort</th>
                <th className="text-center px-4 py-3 font-medium text-ink-muted">Active</th>
                <th className="text-right px-4 py-3 font-medium text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-ink-muted">
                    No devices found
                  </td>
                </tr>
              ) : (
                filtered.map((item, i) => (
                  <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-cream/50"}>
                    <td className="px-4 py-3 text-ink-muted">{item.id}</td>
                    <td className="px-4 py-3 font-medium text-ink">{item.name}</td>
                    <td className="px-4 py-3 text-ink-muted">{item.slug}</td>
                    <td className="px-4 py-3 text-ink-muted">{getBrandName(item.brandId)}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm">{formatCents(item.maxQuoteCents)}</td>
                    <td className="px-4 py-3 text-center text-ink-muted">{item.sortOrder}</td>
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

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? "Edit Device" : "Add Device"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Brand</label>
            <select
              value={form.brandId}
              onChange={(e) => setForm({ ...form, brandId: parseInt(e.target.value) })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            >
              <option value={0} disabled>Select brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Image URL</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Max Quote (cents)</label>
            <input
              type="number"
              value={form.maxQuoteCents}
              onChange={(e) => setForm({ ...form, maxQuoteCents: parseInt(e.target.value) || 0 })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Sort Order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
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
            <label className="block text-sm font-medium text-ink-muted mb-1">Meta Title</label>
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Meta Description</label>
            <textarea
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
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
