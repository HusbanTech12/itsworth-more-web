"use client";

import { useState, useCallback } from "react";
import { SearchInput } from "@/components/ui/SearchInput";

export function DeviceSearch() {
  const [results, setResults] = useState<{ label: string; href: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SearchInput
      placeholder="Search devices..."
      onSearch={handleSearch}
      results={results}
      loading={loading}
      className="w-56"
    />
  );
}
