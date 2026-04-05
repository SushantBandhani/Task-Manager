import { Task } from "@/types";

interface Props {
  tasks: Task[];
}

export function StatsBar({ tasks }: Props) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: "Total", value: total, color: "var(--text-secondary)" },
    { label: "Pending", value: pending, color: "#d4a843" },
    { label: "In Progress", value: inProgress, color: "#6a9e89" },
    { label: "Completed", value: completed, color: "#7a8a7a" },
  ];

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex flex-wrap items-center gap-6 sm:gap-10">
        {stats.map((s) => (
          <div key={s.label}>
            <div
              className="font-display text-2xl font-800 leading-none"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </div>
          </div>
        ))}

        {total > 0 && (
          <div className="flex-1 min-w-[140px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Completion
              </span>
              <span
                className="text-xs font-mono font-500"
                style={{ color: "var(--accent)" }}
              >
                {completionRate}%
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "var(--surface-3)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${completionRate}%`,
                  background: "linear-gradient(90deg, var(--accent-dim), var(--accent))",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
