"use client";

import { useState, useEffect } from "react";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

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
  cancelled: "bg-zinc-100 text-zinc-600",
  return_shipped: "bg-pink-50 text-pink-700",
};

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
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
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.orders ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Orders</h1>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left px-4 py-3 font-medium text-zinc-500">ID</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-500">Offer #</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-500">User</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-500">Status</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-500">Total</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-500">Submitted</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                items.map((item, i) => (
                  <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}>
                    <td className="px-4 py-3 text-zinc-500">{item.id}</td>
                    <td className="px-4 py-3 font-mono text-xs font-medium text-zinc-900">
                      {item.offerNumber}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 max-w-[120px] truncate" title={item.userId}>
                      {item.userId.slice(0, 12)}...
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-xs font-medium rounded-lg px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-primary/50 ${statusColors[item.status] ?? "bg-zinc-100 text-zinc-700"}`}
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
                    <td className="px-4 py-3 text-zinc-500 text-xs">
                      {formatDate(item.submittedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">
                        <a
                          href={`/dashboard/orders/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="no-underline"
                        >
                          View
                        </a>
                      </Button>
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
