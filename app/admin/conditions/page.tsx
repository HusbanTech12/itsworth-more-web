"use client";

import { useState, useEffect } from "react";
import { Modal } from "../_components/Modal";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";

interface Condition {
  id: number;
  slug: string;
  label: string;
  description: string | null;
  isBulk: boolean;
  isRetail: boolean;
  sortOrder: number;
}

const emptyForm = {
  slug: "",
  label: "",
  description: "",
  isBulk: false,
  isRetail: true,
  sortOrder: 0,
};

export default function AdminConditionsPage() {
  const [items, setItems] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Condition | null>(null);
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
      const res = await fetch("/api/admin/conditions");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.conditions ?? []);
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

  function openEdit(item: Condition) {
    setEditing(item);
    setForm({
      slug: item.slug,
      label: item.label,
      description: item.description ?? "",
      isBulk: item.isBulk,
      isRetail: item.isRetail,
      sortOrder: item.sortOrder,
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/conditions/${editing.id}` : "/api/admin/conditions";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      setToast({ open: true, message: editing ? "Condition updated" : "Condition created", variant: "success" });
      setShowForm(false);
      fetchItems();
    } catch {
      setToast({ open: true, message: "Failed to save condition", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this condition?")) return;
    try {
      const res = await fetch(`/api/admin/conditions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setToast({ open: true, message: "Condition deleted", variant: "success" });
      fetchItems();
    } catch {
      setToast({ open: true, message: "Failed to delete condition", variant: "error" });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = items.filter(item => {
    const matchesSearch = !search || item.label?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || (statusFilter === "bulk" ? item.isBulk : item.isRetail);
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Device Conditions</h1>
        <Button onClick={openCreate}>Add Condition</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          placeholder="Search by label..."
          onSearch={setSearch}
          className="w-full sm:max-w-xs"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-40"
          options={[
            { value: "all", label: "All" },
            { value: "bulk", label: "Bulk" },
            { value: "retail", label: "Retail" },
          ]}
        />
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-ink-muted">ID</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Label</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Description</th>
                <th className="text-center px-4 py-3 font-medium text-ink-muted">Bulk</th>
                <th className="text-center px-4 py-3 font-medium text-ink-muted">Retail</th>
                <th className="text-center px-4 py-3 font-medium text-ink-muted">Sort</th>
                <th className="text-right px-4 py-3 font-medium text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-ink-muted">
                    No conditions found
                  </td>
                </tr>
              ) : (
                filtered.map((item, i) => (
                  <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-cream/50"}>
                    <td className="px-4 py-3 text-ink-muted">{item.id}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-muted">{item.slug}</td>
                    <td className="px-4 py-3 font-medium text-ink">{item.label}</td>
                    <td className="px-4 py-3 text-ink-muted max-w-xs truncate">{item.description ?? "—"}</td>
                    <td className="px-4 py-3 text-center">
                      {item.isBulk ? (
                        <span className="text-emerald-600 text-sm">✓</span>
                      ) : (
                        <span className="text-ink-muted text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.isRetail ? (
                        <span className="text-emerald-600 text-sm">✓</span>
                      ) : (
                        <span className="text-ink-muted text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-ink-muted">{item.sortOrder}</td>
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

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? "Edit Condition" : "Add Condition"}>
        <div className="space-y-4">
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
            <label className="block text-sm font-medium text-ink-muted mb-1">Label</label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isBulk}
                onChange={(e) => setForm({ ...form, isBulk: e.target.checked })}
                className="rounded border-border text-orange focus:ring-orange/50"
              />
              <span className="text-sm font-medium text-ink-muted">Bulk</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isRetail}
                onChange={(e) => setForm({ ...form, isRetail: e.target.checked })}
                className="rounded border-border text-orange focus:ring-orange/50"
              />
              <span className="text-sm font-medium text-ink-muted">Retail</span>
            </label>
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
