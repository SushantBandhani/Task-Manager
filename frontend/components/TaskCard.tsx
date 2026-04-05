"use client";

import { Task } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { format, isPast, isToday } from "date-fns";
import clsx from "clsx";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (task: Task) => void;
  index?: number;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggle,
  index = 0,
}: Props) {
  const isOverdue =
    task.dueDate &&
    task.status !== "completed" &&
    isPast(new Date(task.dueDate)) &&
    !isToday(new Date(task.dueDate));

  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  const formatDue = (d: string) => {
    const date = new Date(d);
    if (isToday(date)) return "Today";
    return format(date, "MMM d, yyyy");
  };

  return (
    <div
      className="card group relative flex flex-col gap-3 p-5 transition-all duration-200 hover:border-opacity-60 animate-slide-up"
      style={{
        animationDelay: `${index * 0.04}s`,
        opacity: 0,
        animationFillMode: "forwards",
        borderColor:
          task.status === "completed" ? "var(--border)" : "var(--border)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "var(--border-light)";
        (e.currentTarget as HTMLDivElement).style.background =
          "var(--surface-2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLDivElement).style.background = "var(--surface)";
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={() => onToggle(task)}
            className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md border transition-all duration-150 flex items-center justify-center"
            style={{
              borderColor:
                task.status === "completed"
                  ? "var(--sage)"
                  : "var(--border-light)",
              background:
                task.status === "completed" ? "var(--sage-dim)" : "transparent",
            }}
            title="Toggle status"
          >
            {task.status === "completed" && (
              <svg width="10" height="10" fill="none" viewBox="0 0 12 12">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="var(--sage)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {task.status === "in_progress" && (
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--progress)" }}
              />
            )}
          </button>

          <h3
            className={clsx(
              "font-display font-600 text-sm leading-snug truncate",
              task.status === "completed" && "line-through opacity-50",
            )}
            style={{ color: "var(--text-primary)" }}
            title={task.title}
          >
            {task.title}
          </h3>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--surface-3)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-muted)";
            }}
            title="Edit task"
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
              <path
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--rose-dim)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--rose)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-muted)";
            }}
            title="Delete task"
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
              <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p
          className={clsx(
            "text-xs leading-relaxed line-clamp-2",
            task.status === "completed" && "opacity-40",
          )}
          style={{ color: "var(--text-secondary)" }}
        >
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 mt-auto pt-1">
        <StatusBadge status={task.status} size="xs" />

        {task.dueDate && (
          <div
            className="flex items-center gap-1 text-xs font-mono"
            style={{
              color: isOverdue
                ? "var(--rose)"
                : isDueToday
                  ? "var(--accent)"
                  : "var(--text-muted)",
            }}
          >
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24">
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M16 2v4M8 2v4M3 10h18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            {isOverdue && "Overdue · "}
            {formatDue(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  );
}
