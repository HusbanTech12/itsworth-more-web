"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export interface DeviceDetails {
  storage: string;
  color: string;
  carrier: string;
  imei: string;
  serialNumber: string;
  hasCharger: boolean;
  hasCable: boolean;
  hasBox: boolean;
  notes: string;
}

interface DeviceDetailsFormProps {
  deviceSlug: string;
  deviceName: string;
  onChange: (details: DeviceDetails) => void;
}

const storageOptionsMap: Record<string, { value: string; label: string }[]> = {
  "iphone-17-pro-max": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "iphone-17-pro": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "iphone-17": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-17e": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-16-pro-max": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "iphone-16-pro": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "iphone-16": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-16-plus": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-15-pro-max": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "iphone-15-pro": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-15": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-14-pro-max": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "iphone-14": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-13": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-13-mini": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "iphone-12": [
    { value: "64", label: "64GB" },
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
  ],
  "iphone-se-3rd-gen": [
    { value: "64", label: "64GB" },
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
  ],
  "galaxy-s25-ultra": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "galaxy-s25-plus": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "galaxy-s25": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
  ],
  "galaxy-s24-ultra": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "galaxy-z-fold-6": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "galaxy-z-flip-6": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "pixel-9-pro": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
  ],
  "pixel-9": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
  ],
  "ipad-pro-m4": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
    { value: "2048", label: "2TB" },
  ],
  "ipad-air-m2": [
    { value: "128", label: "128GB" },
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
  "macbook-pro-16-m4": [
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
    { value: "2048", label: "2TB" },
    { value: "4096", label: "4TB" },
  ],
  "macbook-air-15-m4": [
    { value: "256", label: "256GB" },
    { value: "512", label: "512GB" },
    { value: "1024", label: "1TB" },
  ],
};

const defaultStorageMap: Record<string, string> = {
  "iphone-17-pro-max": "256",
  "iphone-17-pro": "256",
  "iphone-16-pro-max": "256",
  "iphone-16-pro": "128",
  "iphone-15-pro-max": "256",
  "iphone-15-pro": "128",
  "iphone-14-pro-max": "128",
  "iphone-12": "128",
  "iphone-se-3rd-gen": "128",
  "galaxy-s25-ultra": "256",
  "galaxy-s25-plus": "256",
  "galaxy-s24-ultra": "256",
  "galaxy-z-fold-6": "256",
  "galaxy-z-flip-6": "256",
  "ipad-pro-m4": "256",
  "ipad-air-m2": "128",
  "macbook-pro-16-m4": "512",
  "macbook-air-15-m4": "256",
};

const colorOptions = [
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "silver", label: "Silver" },
  { value: "space-gray", label: "Space Gray" },
  { value: "gold", label: "Gold" },
  { value: "rose-gold", label: "Rose Gold" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "green", label: "Green" },
  { value: "red", label: "Red" },
  { value: "graphite", label: "Graphite" },
  { value: "sierra-blue", label: "Sierra Blue" },
  { value: "alpine-green", label: "Alpine Green" },
  { value: "deep-purple", label: "Deep Purple" },
  { value: "titanium", label: "Titanium" },
];

const carrierOptions = [
  { value: "unlocked", label: "Unlocked" },
  { value: "att", label: "AT&T" },
  { value: "verizon", label: "Verizon" },
  { value: "tmobile", label: "T-Mobile" },
  { value: "sprint", label: "Sprint" },
  { value: "visible", label: "Visible" },
  { value: "cricket", label: "Cricket" },
  { value: "metro", label: "Metro by T-Mobile" },
  { value: "boost", label: "Boost Mobile" },
  { value: "other", label: "Other" },
];

export function DeviceDetailsForm({
  deviceSlug,
  deviceName,
  onChange,
}: DeviceDetailsFormProps) {
  const defaultStorage = defaultStorageMap[deviceSlug] || "128";

  const [selectedStorage, setSelectedStorage] = useState(defaultStorage);
  const [color, setColor] = useState("");
  const [carrier, setCarrier] = useState("");
  const [imei, setImei] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [hasCharger, setHasCharger] = useState(true);
  const [hasCable, setHasCable] = useState(true);
  const [hasBox, setHasBox] = useState(false);
  const [notes, setNotes] = useState("");

  const emitChange = useCallback(
    (updates: Partial<DeviceDetails>) => {
      onChange({
        storage: selectedStorage,
        color,
        carrier,
        imei,
        serialNumber,
        hasCharger,
        hasCable,
        hasBox,
        notes,
        ...updates,
      });
    },
    [
      selectedStorage,
      color,
      carrier,
      imei,
      serialNumber,
      hasCharger,
      hasCable,
      hasBox,
      notes,
      onChange,
    ],
  );

  const storageOpts =
    storageOptionsMap[deviceSlug] || [
      { value: "128", label: "128GB" },
      { value: "256", label: "256GB" },
      { value: "512", label: "512GB" },
    ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Storage"
          options={storageOpts}
          value={selectedStorage}
          placeholder="Select storage"
          onChange={(e) => {
            const v = e.target.value;
            setSelectedStorage(v);
            emitChange({ storage: v });
          }}
        />
        <Select
          label="Color"
          options={colorOptions}
          value={color}
          placeholder="Select color"
          onChange={(e) => {
            const v = e.target.value;
            setColor(v);
            emitChange({ color: v });
          }}
        />
      </div>

      <Select
        label="Carrier / Network"
        options={carrierOptions}
        value={carrier}
        placeholder="Select carrier"
        onChange={(e) => {
          const v = e.target.value;
          setCarrier(v);
          emitChange({ carrier: v });
        }}
      />

      <Input
        label="IMEI / MEID"
        placeholder="Enter IMEI number (optional)"
        value={imei}
        onChange={(e) => {
          const v = e.target.value;
          setImei(v);
          emitChange({ imei: v });
        }}
        helperText="Helps us verify device status faster"
      />

      <Input
        label="Serial Number"
        placeholder="Enter serial number (optional)"
        value={serialNumber}
        onChange={(e) => {
          const v = e.target.value;
          setSerialNumber(v);
          emitChange({ serialNumber: v });
        }}
      />

      <div>
        <p className="text-sm font-medium text-zinc-700 mb-2.5">
          Accessories Included
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { key: "hasCharger" as const, label: "Charger" },
            { key: "hasCable" as const, label: "Charging Cable" },
            { key: "hasBox" as const, label: "Original Box" },
          ].map((acc) => {
            const checked =
              acc.key === "hasCharger"
                ? hasCharger
                : acc.key === "hasCable"
                  ? hasCable
                  : hasBox;
            return (
              <button
                key={acc.key}
                type="button"
                onClick={() => {
                  const newVal = !checked;
                  const upd = { [acc.key]: newVal };
                  if (acc.key === "hasCharger") setHasCharger(newVal);
                  if (acc.key === "hasCable") setHasCable(newVal);
                  if (acc.key === "hasBox") setHasBox(newVal);
                  emitChange(upd);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm transition-all ${
                  checked
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${
                    checked ? "text-primary" : "text-zinc-300"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {checked ? (
                    <path d="M5 13l4 4L19 7" />
                  ) : (
                    <path d="M12 4v16m8-8H4" />
                  )}
                </svg>
                {acc.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
