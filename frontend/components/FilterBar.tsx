"use client";

import { FilterStatus } from "@/types";
import clsx from "clsx";
import { useRef } from "react";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  filterStatus: FilterStatus;
  onFilterChange: (v: FilterStatus) => void;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
  resultCount: number;
}

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Done" },
];

export function FilterBar({
  search,
  onSearchChange,
  filterStatus,
  onFilterChange,
  view,
  onViewChange,
  resultCount,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col sm:flex-row gap-3">

      <div className="relative flex-1">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          style={{ color: "var(--text-muted)" }}
        >
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M21 21l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks…"
          className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        />
        {search && (
          <button
            onClick={() => { onSearchChange(""); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-all"
            style={{ color: "var(--text-muted)", background: "var(--surface-2)" }}
          >
            <svg width="9" height="9" fill="none" viewBox="0 0 24 24">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>


      <div
        className="flex items-center rounded-xl p-1 gap-0.5"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs font-600 transition-all whitespace-nowrap"
            )}
            style={{
              background: filterStatus === f.value ? "var(--surface-3)" : "transparent",
              color: filterStatus === f.value ? "var(--text-primary)" : "var(--text-muted)",
              border: filterStatus === f.value ? "1px solid var(--border-light)" : "1px solid transparent",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>


      <div
        className="hidden sm:flex items-center rounded-xl p-1 gap-0.5"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {(["grid", "list"] as const).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: view === v ? "var(--surface-3)" : "transparent",
              color: view === v ? "var(--text-primary)" : "var(--text-muted)",
              border: view === v ? "1px solid var(--border-light)" : "1px solid transparent",
            }}
            title={v === "grid" ? "Grid view" : "List view"}
          >
            {v === "grid" ? (
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            ) : (
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
