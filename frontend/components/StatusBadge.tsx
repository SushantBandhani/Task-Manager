import { TaskStatus } from "@/types";
import clsx from "clsx";

const config: Record<TaskStatus, { label: string; dot: string; bg: string; text: string }> = {
  pending: {
    label: "Pending",
    dot: "#d4a843",
    bg: "rgba(212, 168, 67, 0.1)",
    text: "#d4a843",
  },
  in_progress: {
    label: "In Progress",
    dot: "#6a9e89",
    bg: "rgba(106, 158, 137, 0.1)",
    text: "#6a9e89",
  },
  completed: {
    label: "Completed",
    dot: "#7a8a7a",
    bg: "rgba(122, 138, 122, 0.1)",
    text: "#7a8a7a",
  },
};

export function StatusBadge({ status, size = "sm" }: { status: TaskStatus; size?: "xs" | "sm" }) {
  const c = config[status as TaskStatus] ?? {
    label: "Unknown",
    dot: "#999",
    bg: "rgba(200, 200, 200, 0.1)",
    text: "#666",
  };
  
  return (
    <span
      className={clsx("inline-flex items-center gap-1.5 rounded-full font-500", size === "xs" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs")}
      style={{ background: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}
