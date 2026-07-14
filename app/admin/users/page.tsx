"use client";

import { useState, useEffect } from "react";
import { Modal } from "../_components/Modal";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";

interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = {
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  isActive: true,
};

export default function AdminUsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<User | null>(null);
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
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.users ?? []);
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

  function openEdit(item: User) {
    setEditing(item);
    setForm({
      id: item.id,
      email: item.email ?? "",
      firstName: item.firstName ?? "",
      lastName: item.lastName ?? "",
      isActive: item.isActive,
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/admin/users/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
            isActive: form.isActive,
          }),
        });
        if (!res.ok) throw new Error("Failed to update");
        setToast({ open: true, message: "User updated", variant: "success" });
      } else {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to create");
        setToast({ open: true, message: "User created", variant: "success" });
      }
      setShowForm(false);
      fetchItems();
    } catch {
      setToast({ open: true, message: `Failed to ${editing ? "update" : "create"} user`, variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to deactivate this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setToast({ open: true, message: "User deactivated", variant: "success" });
      fetchItems();
    } catch {
      setToast({ open: true, message: "Failed to deactivate user", variant: "error" });
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = items.filter(item => {
    const name = [item.firstName, item.lastName].filter(Boolean).join(" ").toLowerCase();
    const email = (item.email ?? "").toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch = !search || name.includes(query) || email.includes(query);
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? item.isActive : !item.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Users</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink-muted">{items.length} users</span>
          <Button onClick={openCreate}>Add User</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          placeholder="Search by email or name..."
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
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Email</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Name</th>
                <th className="text-center px-4 py-3 font-medium text-ink-muted">Active</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Created</th>
                <th className="text-right px-4 py-3 font-medium text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((item, i) => (
                  <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-cream/50"}>
                    <td className="px-4 py-3 text-ink-muted font-mono text-xs max-w-[120px] truncate" title={item.id}>
                      {item.id.slice(0, 12)}...
                    </td>
                    <td className="px-4 py-3 text-ink">{item.email ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-muted">
                      {[item.firstName, item.lastName].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.isActive ? "bg-emerald-50 text-emerald-700" : "bg-cream text-ink-muted"
                      }`}>
                        {item.isActive ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted text-xs">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                          Edit
                        </Button>
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

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? "Edit User" : "Add User"}>
        <div className="space-y-4">
          {!editing && (
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-1">Clerk User ID</label>
              <input
                type="text"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
                placeholder="user_..."
              />
              <p className="text-xs text-ink-muted mt-1">The Clerk user ID from the user&apos;s profile</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
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
            <Button onClick={handleSave} loading={saving}>
              {editing ? "Update" : "Create"}
            </Button>
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
