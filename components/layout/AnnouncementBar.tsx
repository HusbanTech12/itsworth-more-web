"use client";

export function AnnouncementBar() {
  const stats = [
    { label: "Rating", value: "4.8", icon: "★" },
    { label: "Accreditation", value: "BBB A+", icon: "✓" },
    { label: "Payout Speed", value: "24h", icon: "⚡" },
    { label: "Shipping", value: "Free", icon: "↗" },
  ];

  return (
    <div className="bg-ink border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 sm:gap-10 py-3 sm:py-3.5 text-xs">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded bg-lime/20 text-lime text-[9px] sm:text-[10px] font-bold">
                {stat.icon}
              </span>
              <span className="font-semibold text-white">{stat.value}</span>
              <span className="text-white/50 hidden sm:inline">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
