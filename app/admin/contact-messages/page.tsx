"use client";

import { useState, useEffect } from "react";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminContactMessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
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
      const res = await fetch("/api/admin/contact-messages");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.messages ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function toggleRead(id: number, isRead: boolean) {
    try {
      const res = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !isRead }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setToast({ open: true, message: isRead ? "Marked as unread" : "Marked as read", variant: "success" });
      fetchItems();
    } catch {
      setToast({ open: true, message: "Failed to update message", variant: "error" });
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
        <h1 className="text-2xl font-bold text-zinc-900">Contact Messages</h1>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center text-zinc-400">
            No messages found
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border transition-shadow hover:shadow-sm ${
                !item.isRead ? "border-primary/30 ring-1 ring-primary/10" : "border-zinc-200"
              }`}
            >
              <button
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${!item.isRead ? "bg-primary" : "bg-transparent"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-zinc-900">{item.name}</span>
                    <span className="text-zinc-400">·</span>
                    <span className="text-sm text-zinc-500">{item.email}</span>
                  </div>
                  <p className="text-sm text-zinc-700 mt-0.5 truncate">{item.subject}</p>
                </div>
                <span className="text-xs text-zinc-400 shrink-0">{formatDate(item.createdAt)}</span>
              </button>
              {expandedId === item.id && (
                <div className="px-5 pb-4 pt-0 border-t border-zinc-100">
                  <div className="mt-3 p-4 bg-zinc-50 rounded-lg">
                    <p className="text-sm text-zinc-700 whitespace-pre-wrap">{item.message}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">{item.email}</span>
                      {item.isRead && (
                        <span className="text-xs text-zinc-400">· Read</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRead(item.id, item.isRead);
                      }}
                    >
                      {item.isRead ? "Mark Unread" : "Mark Read"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
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
