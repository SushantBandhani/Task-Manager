"use client";

import { useEffect, useRef } from "react";
import { Task } from "@/types";

interface Props {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function DeleteDialog({ open, task, onClose, onConfirm, loading }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open || !task) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,8,6,0.8)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="w-full max-w-sm animate-scale-in rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border-light)" }}
      >
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "var(--rose-dim)" }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h3 className="font-display font-700 text-lg mb-2" style={{ color: "var(--text-primary)" }}>
            Delete task?
          </h3>
          <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            You&apos;re about to permanently delete:
          </p>
          <p className="text-sm font-600 px-4 py-2 rounded-lg my-3 truncate"
            style={{ background: "var(--surface-2)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
            {task.title}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="btn-ghost flex-1 py-3 rounded-xl text-sm font-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-600 transition-all"
            style={{
              background: "var(--rose-dim)",
              color: "var(--rose)",
              border: "1px solid rgba(201,107,107,0.25)",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,107,107,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--rose-dim)";
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Deleting…
              </span>
            ) : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
