"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";

interface Order {
  id: number;
  offerNumber: string;
  userId: string;
  status: string;
  totalCents: number;
  submittedAt: string | null;
  createdAt: string;
}

const statusOptions = [
  "quote_pending",
  "quote_accepted",
  "device_shipped",
  "device_received",
  "inspecting",
  "offer_revised",
  "offer_accepted",
  "offer_declined",
  "payment_sent",
  "completed",
  "cancelled",
  "return_shipped",
];

const statusColors: Record<string, string> = {
  quote_pending: "bg-amber-50 text-amber-700",
  quote_accepted: "bg-blue-50 text-blue-700",
  device_shipped: "bg-indigo-50 text-indigo-700",
  device_received: "bg-cyan-50 text-cyan-700",
  inspecting: "bg-violet-50 text-violet-700",
  offer_revised: "bg-orange-50 text-orange-700",
  offer_accepted: "bg-emerald-50 text-emerald-700",
  offer_declined: "bg-red-50 text-red-700",
  payment_sent: "bg-green-50 text-green-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-cream text-ink-muted",
  return_shipped: "bg-pink-50 text-pink-700",
};

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState<{ open: boolean; message: string; variant: "success" | "error" }>({
    open: false,
    message: "",
    variant: "success",
  });

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.orders ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : data.orders ?? []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleStatusChange(id: number, status: string) {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setToast({ open: true, message: "Order status updated", variant: "success" });
      fetchItems();
    } catch {
      setToast({ open: true, message: "Failed to update order", variant: "error" });
    }
  }

  function formatCurrency(cents: number) {
    return "$" + (cents / 100).toFixed(2);
  }

  function formatDate(date: string | null) {
    if (!date) return "—";
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
    const matchesSearch = !search || item.offerNumber?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Orders</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          placeholder="Search by offer number..."
          onSearch={setSearch}
          className="w-full sm:max-w-xs"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-44"
          options={[
            { value: "all", label: "All Statuses" },
            ...statusOptions.map((s) => ({ value: s, label: s.replace(/_/g, " ") })),
          ]}
        />
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-ink-muted">ID</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Offer #</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">User</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Status</th>
                <th className="text-right px-4 py-3 font-medium text-ink-muted">Total</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Submitted</th>
                <th className="text-right px-4 py-3 font-medium text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ink-muted">
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((item, i) => (
                  <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-cream/50"}>
                    <td className="px-4 py-3 text-ink-muted">{item.id}</td>
                    <td className="px-4 py-3 font-mono text-xs font-medium text-ink">
                      {item.offerNumber}
                    </td>
                    <td className="px-4 py-3 text-ink-muted max-w-[120px] truncate" title={item.userId}>
                      {item.userId.slice(0, 12)}...
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-xs font-medium rounded-lg px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-orange/50 ${statusColors[item.status] ?? "bg-cream text-ink-muted"}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {formatCurrency(item.totalCents)}
                    </td>
                    <td className="px-4 py-3 text-ink-muted text-xs">
                      {formatDate(item.submittedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/orders/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </td>
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
