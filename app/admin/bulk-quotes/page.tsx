"use client";

import { useState, useEffect } from "react";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";

interface BulkQuote {
  id: number;
  name: string;
  companyName: string | null;
  email: string;
  phone: string | null;
  type: string;
  status: string;
  comments: string | null;
  createdAt: string;
}

const statusOptions = ["new", "contacted", "quoted", "closed"];

const statusColors: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  quoted: "bg-emerald-50 text-emerald-700",
  closed: "bg-cream text-ink-muted",
};

export default function AdminBulkQuotesPage() {
  const [items, setItems] = useState<BulkQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState<{ open: boolean; message: string; variant: "success" | "error" }>({
    open: false,
    message: "",
    variant: "success",
  });

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/bulk-quotes");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.quotes ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/bulk-quotes");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : data.quotes ?? []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleStatusChange(id: number, status: string) {
    try {
      const res = await fetch(`/api/admin/bulk-quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setToast({ open: true, message: "Status updated", variant: "success" });
      fetchItems();
    } catch {
      setToast({ open: true, message: "Failed to update status", variant: "error" });
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
    const query = search.toLowerCase();
    const matchesSearch = !search || item.name.toLowerCase().includes(query) || (item.companyName ?? "").toLowerCase().includes(query);
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Bulk Quotes & ITAD Requests</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          placeholder="Search by name or company..."
          onSearch={setSearch}
          className="w-full sm:max-w-xs"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-40"
          options={[
            { value: "all", label: "All Statuses" },
            ...statusOptions.map((s) => ({ value: s, label: s })),
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
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Company</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Email</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Type</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Status</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ink-muted">
                    No bulk quote requests found
                  </td>
                </tr>
              ) : (
                filtered.map((item, i) => (
                  <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-cream/50"}>
                    <td className="px-4 py-3 text-ink-muted">{item.id}</td>
                    <td className="px-4 py-3 font-medium text-ink">{item.name}</td>
                    <td className="px-4 py-3 text-ink-muted">{item.companyName ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-muted">{item.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.type === "bulk" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-xs font-medium rounded-lg px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-orange/50 ${statusColors[item.status] ?? "bg-cream text-ink-muted"}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-ink-muted text-xs">{formatDate(item.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        variant={toast.variant}
      />
    </div>
  );
}
