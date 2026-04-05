"use client";

import { useState, useEffect, useRef } from "react";
import { Task, CreateTaskPayload, TaskStatus } from "@/types";
import { format } from "date-fns";
import clsx from "clsx";

interface Props {
  open: boolean;
  task?: Task | null;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => Promise<void>;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: "pending", label: "Pending", color: "#d4a843" },
  { value: "in_progress", label: "In Progress", color: "#6a9e89" },
  { value: "completed", label: "Completed", color: "#7a8a7a" },
];

export function TaskModal({ open, task, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CreateTaskPayload>({
    title: "",
    description: "",
    status: "pending",
    dueDate: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const titleRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      if (task) {
        setForm({
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: task.dueDate
            ? format(new Date(task.dueDate), "yyyy-MM-dd")
            : null,
        });
      } else {
        setForm({ title: "", description: "", status: "pending", dueDate: null });
      }
      setErrors({});
      setTimeout(() => titleRef.current?.focus(), 80);
    }
  }, [open, task]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    else if (form.title.length > 120) e.title = "Title is too long";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate || null,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(10,8,6,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="w-full sm:max-w-lg animate-scale-in rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border-light)" }}
      >
        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h2 className="font-display font-700 text-lg" style={{ color: "var(--text-primary)" }}>
              {task ? "Edit task" : "New task"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {task ? "Update the task details below" : "Fill in the details to create a task"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ color: "var(--text-muted)", background: "var(--surface-2)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-xs font-600 uppercase tracking-wider mb-2"
              style={{ color: "var(--text-muted)" }}>
              Title <span style={{ color: "var(--rose)" }}>*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              value={form.title}
              onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: "" }); }}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{
                background: "var(--surface-2)",
                border: `1px solid ${errors.title ? "var(--rose)" : "var(--border)"}`,
                color: "var(--text-primary)",
              }}
            />
            {errors.title && (
              <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--rose)" }}>
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-600 uppercase tracking-wider mb-2"
              style={{ color: "var(--text-muted)" }}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add details, notes, or context…"
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-600 uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}>
                Status
              </label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
                  className="w-full px-4 py-3 rounded-xl text-sm appearance-none pr-9"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value} style={{ background: "var(--surface-2)" }}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  width="12" height="12" fill="none" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-xs font-600 uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}>
                Due date
              </label>
              <input
                type="date"
                value={form.dueDate || ""}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value || null })}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: form.dueDate ? "var(--text-primary)" : "var(--text-muted)",
                  colorScheme: "dark",
                }}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setForm({ ...form, status: s.value })}
                className={clsx("flex-1 py-2 rounded-lg text-xs font-600 transition-all border")}
                style={{
                  background: form.status === s.value ? `${s.color}18` : "transparent",
                  borderColor: form.status === s.value ? `${s.color}50` : "var(--border)",
                  color: form.status === s.value ? s.color : "var(--text-muted)",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1 py-3 rounded-xl text-sm font-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-3 rounded-xl text-sm"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Saving…
                </span>
              ) : task ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
