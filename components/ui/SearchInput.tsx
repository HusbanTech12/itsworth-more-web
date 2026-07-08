"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  results?: { label: string; href: string }[];
  loading?: boolean;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  placeholder = "Search...",
  onSearch,
  results = [],
  loading = false,
  debounceMs = 300,
  className = "",
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(value), debounceMs);
  }

  const showDropdown = focused && query.length > 0;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          className="flex h-10 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-primary" />
          </div>
        )}
      </div>
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-zinc-500">No results found</div>
          ) : (
            results.map((r, i) => (
              <a
                key={i}
                href={r.href}
                className="block px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
              >
                {r.label}
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}
