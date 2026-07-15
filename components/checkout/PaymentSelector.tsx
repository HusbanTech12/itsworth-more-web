"use client";

import { Input } from "@/components/ui/Input";

type PaymentMethod = "check" | "paypal" | "zelle";

interface PaymentSelectorProps {
  method: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  email: string;
  onEmailChange: (email: string) => void;
  emailError?: string;
}

export function PaymentSelector({
  method,
  onChange,
  email,
  onEmailChange,
  emailError,
}: PaymentSelectorProps) {
  const options: { id: PaymentMethod; label: string; description: string }[] = [
    { id: "check", label: "Check", description: "Mailed to your address. 5-10 business days." },
    { id: "paypal", label: "PayPal", description: "Fast & secure. Funds sent to your PayPal." },
    { id: "zelle", label: "Zelle", description: "Instant. Sent to your Zelle-registered email." },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-900">Payment Method</h2>

      <div className="space-y-3">
        {options.map((opt) => {
          const selected = method === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                selected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-zinc-200 hover:border-zinc-300 bg-white"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selected ? "border-primary" : "border-zinc-300"
                }`}
              >
                {selected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-zinc-900">{opt.label}</p>
                <p className="text-xs text-zinc-500">{opt.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {(method === "paypal" || method === "zelle") && (
        <Input
          label={`${method === "paypal" ? "PayPal" : "Zelle"} Email`}
          type="email"
          aria-label={`${method === "paypal" ? "PayPal" : "Zelle"} email address`}
          placeholder="email@example.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          error={emailError}
          helperText={`Enter the email associated with your ${method === "paypal" ? "PayPal" : "Zelle"} account.`}
        />
      )}

      {method === "check" && (
        <div className="rounded-lg bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm text-zinc-600">
          Your check will be mailed to the shipping address provided above.
        </div>
      )}
    </div>
  );
}
