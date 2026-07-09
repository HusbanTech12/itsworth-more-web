"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalCategories: number;
  totalDevices: number;
  activeCoupons: number;
  unreadMessages: number;
  pendingBulkQuotes: number;
}

const defaultStats: Stats = {
  totalOrders: 0,
  pendingOrders: 0,
  totalRevenue: 0,
  totalUsers: 0,
  totalCategories: 0,
  totalDevices: 0,
  activeCoupons: 0,
  unreadMessages: 0,
  pendingBulkQuotes: 0,
};

const cards = [
  { key: "totalOrders", label: "Total Orders", color: "bg-blue-500", href: "/admin/orders" },
  { key: "pendingOrders", label: "Pending Orders", color: "bg-amber-500", href: "/admin/orders" },
  { key: "totalRevenue", label: "Total Revenue", color: "bg-emerald-500", href: "/admin/orders", format: true },
  { key: "totalUsers", label: "Total Users", color: "bg-violet-500", href: "/admin/users" },
  { key: "totalCategories", label: "Categories", color: "bg-cyan-500", href: "/admin/categories" },
  { key: "totalDevices", label: "Devices", color: "bg-rose-500", href: "/admin/devices" },
  { key: "activeCoupons", label: "Active Coupons", color: "bg-orange-500", href: "/admin/coupons" },
  { key: "unreadMessages", label: "Unread Messages", color: "bg-indigo-500", href: "/admin/contact-messages" },
  { key: "pendingBulkQuotes", label: "Pending Quotes", color: "bg-teal-500", href: "/admin/bulk-quotes" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function formatCurrency(cents: number) {
    return "$" + (cents / 100).toFixed(2);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const value = stats[card.key as keyof Stats];
          return (
            <Link
              key={card.key}
              href={card.href}
              className="bg-white rounded-xl border border-zinc-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                  <span className="text-white text-lg font-bold">
                    {card.key === "totalRevenue" ? "$" : ""}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="text-xl font-bold text-zinc-900 mt-0.5">
                    {loading ? (
                      <span className="inline-block w-16 h-5 bg-zinc-200 rounded animate-pulse" />
                    ) : card.format ? (
                      formatCurrency(value)
                    ) : (
                      value.toLocaleString()
                    )}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
