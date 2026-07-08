"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastProps {
  open: boolean;
  onClose: () => void;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  icon?: ReactNode;
}

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-emerald-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-primary text-white",
  warning: "bg-amber-500 text-white",
};

export function Toast({
  open,
  onClose,
  message,
  variant = "info",
  duration = 4000,
  icon,
}: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (open) {
      timerRef.current = setTimeout(() => {
        closeTimerRef.current = setTimeout(onClose, 300);
      }, duration);
    }
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(closeTimerRef.current);
    };
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div
        className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg ${variantStyles[variant]}`}
      >
        {icon}
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            clearTimeout(timerRef.current);
            onClose();
          }}
          className="ml-2 rounded p-0.5 hover:opacity-80"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
