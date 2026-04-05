"use client";

import { Task } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { format, isPast, isToday } from "date-fns";
import clsx from "clsx";

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (task: Task) => void;
}

export function TaskList({ tasks, onEdit, onDelete, onToggle }: Props) {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-fade-in"
      style={{ border: "1px solid var(--border)" }}
    >
      <div
        className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 text-xs font-600 uppercase tracking-wider"
        style={{
          color: "var(--text-muted)",
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span>Task</span>
        <span className="w-28 text-center">Status</span>
        <span className="w-28 text-right">Due date</span>
        <span className="w-16" />
      </div>

      <div style={{ background: "var(--surface)" }}>
        {tasks.map((task, i) => {
          const isOverdue =
            task.dueDate &&
            task.status !== "completed" &&
            isPast(new Date(task.dueDate)) &&
            !isToday(new Date(task.dueDate));
          const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

          return (
            <div
              key={task.id}
              className="group flex sm:grid sm:grid-cols-[1fr_auto_auto_auto] gap-3 sm:gap-4 items-center px-5 py-4 animate-slide-up transition-colors"
              style={{
                borderBottom: i < tasks.length - 1 ? "1px solid var(--border)" : "none",
                animationDelay: `${i * 0.03}s`,
                opacity: 0,
                animationFillMode: "forwards",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "var(--surface-2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
              }}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  onClick={() => onToggle(task)}
                  className="flex-shrink-0 w-5 h-5 rounded-md border transition-all flex items-center justify-center"
                  style={{
                    borderColor: task.status === "completed" ? "var(--sage)" : "var(--border-light)",
                    background: task.status === "completed" ? "var(--sage-dim)" : "transparent",
                  }}
                >
                  {task.status === "completed" && (
                    <svg width="10" height="10" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="var(--sage)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {task.status === "in_progress" && (
                    <div className="w-2 h-2 rounded-full" style={{ background: "var(--progress)" }} />
                  )}
                </button>
                <div className="min-w-0">
                  <p
                    className={clsx(
                      "text-sm font-600 truncate",
                      task.status === "completed" && "line-through opacity-50"
                    )}
                    style={{ color: "var(--text-primary)" }}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="hidden sm:flex w-28 justify-center">
                <StatusBadge status={task.status} size="xs" />
              </div>

              <div className="hidden sm:flex w-28 justify-end">
                {task.dueDate ? (
                  <span
                    className="text-xs font-mono"
                    style={{
                      color: isOverdue
                        ? "var(--rose)"
                        : isDueToday
                        ? "var(--accent)"
                        : "var(--text-muted)",
                    }}
                  >
                    {isOverdue && "⚠ "}
                    {format(new Date(task.dueDate), "MMM d")}
                  </span>
                ) : (
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>—</span>
                )}
              </div>

              <div className="flex items-center gap-1 w-16 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(task)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-3)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                  }}
                >
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(task)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--rose-dim)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--rose)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                  }}
                >
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
