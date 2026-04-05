interface Props {
  isFiltered: boolean;
  onClear: () => void;
  onCreate: () => void;
}

export function EmptyState({ isFiltered, onClear, onCreate }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      {isFiltered ? (
        <>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="var(--text-muted)" strokeWidth="1.8"/>
              <path d="M21 21l-4.35-4.35" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M8 11h6M11 8v6" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" opacity="0"/>
            </svg>
          </div>
          <h3 className="font-display font-700 text-lg mb-2" style={{ color: "var(--text-primary)" }}>
            No tasks found
          </h3>
          <p className="text-sm max-w-xs mb-6" style={{ color: "var(--text-secondary)" }}>
            Your search or filter didn&apos;t match any tasks. Try adjusting your criteria.
          </p>
          <button
            onClick={onClear}
            className="btn-ghost px-5 py-2.5 rounded-xl text-sm font-600"
          >
            Clear filters
          </button>
        </>
      ) : (
        <>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: "var(--accent-glow)", border: "1px solid rgba(212,168,67,0.2)" }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 12v4M10 14h4"
                stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="font-display font-700 text-lg mb-2" style={{ color: "var(--text-primary)" }}>
            No tasks yet
          </h3>
          <p className="text-sm max-w-xs mb-6" style={{ color: "var(--text-secondary)" }}>
            You&apos;re all clear! Add your first task to get started and stay on top of your work.
          </p>
          <button
            onClick={onCreate}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Create first task
          </button>
        </>
      )}
    </div>
  );
}
