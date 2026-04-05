"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  onNewTask: () => void;
}

export function Navbar({ onNewTask }: Props) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully");
    router.push("/login");
  };

  const initials = user?.firstName && user?.lastName
  ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  : "??";
  
  return (
    <header
      className="sticky top-0 z-30 px-4 sm:px-6 py-4"
      style={{
        background: "rgba(14,12,10,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--accent)" }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M9 12l2 2 4-4"
                stroke="#0e0c0a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            className="font-display font-700 text-lg hidden sm:block"
            style={{ color: "var(--text-primary)" }}
          >
            Taskr
          </span>
        </div>


        <div className="flex items-center gap-3">

          <button
            onClick={onNewTask}
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="hidden sm:inline">New task</span>
            <span className="sm:hidden">New</span>
          </button>


          <div className="flex items-center gap-2.5 pl-3" style={{ borderLeft: "1px solid var(--border)" }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-700"
              style={{ background: "var(--surface-3)", color: "var(--accent)", border: "1px solid var(--border-light)" }}
            >
              {initials}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-600 leading-tight" style={{ color: "var(--text-primary)" }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs leading-tight" style={{ color: "var(--text-muted)" }}>
                {user?.email}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg flex items-center justify-center ml-1 transition-all"
              style={{ color: "var(--text-muted)" }}
              title="Sign out"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-2)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--rose)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
              }}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                <path
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
