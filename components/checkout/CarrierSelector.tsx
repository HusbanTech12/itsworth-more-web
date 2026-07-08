"use client";

import { Card } from "@/components/ui/Card";

type Carrier = "fedex" | "ups";

interface CarrierSelectorProps {
  value: Carrier;
  onChange: (carrier: Carrier) => void;
}

export function CarrierSelector({ value, onChange }: CarrierSelectorProps) {
  const carriers: { id: Carrier; name: string; description: string; icon: string }[] = [
    { id: "fedex", name: "FedEx", description: "Reliable and fast delivery", icon: "F" },
    { id: "ups", name: "UPS", description: "Trusted shipping worldwide", icon: "U" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-900">Shipping Carrier</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {carriers.map((c) => {
          const selected = value === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                selected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-zinc-200 hover:border-zinc-300 bg-white"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                  selected ? "bg-primary text-white" : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {c.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">{c.name}</p>
                <p className="text-xs text-zinc-500">{c.description}</p>
              </div>
              <div className="ml-auto">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selected ? "border-primary" : "border-zinc-300"
                  }`}
                >
                  {selected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
