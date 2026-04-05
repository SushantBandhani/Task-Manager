"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err) {
      const msg =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Invalid credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(160deg, #161310 0%, #1a1208 100%)" }}>
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #d4a843, transparent 70%)" }} />

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent)" }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="#0e0c0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-700 text-xl" style={{ color: "var(--text-primary)" }}>Taskr</span>
          </div>
        </div>

        <div className="relative space-y-6">
          <h1 className="font-display text-5xl font-800 leading-tight" style={{ color: "var(--text-primary)" }}>
            Every great<br />
            <span className="text-gradient">achievement</span><br />
            starts with a task.
          </h1>
          <p style={{ color: "var(--text-secondary)" }} className="text-lg max-w-sm">
            Organize your work, track your progress, and get things done — beautifully.
          </p>

          <div className="flex gap-6 pt-4">
            {[
              { n: "2.4k", label: "Tasks completed" },
              { n: "98%", label: "On-time rate" },
              { n: "12min", label: "Avg. task time" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-700 text-gradient">{s.n}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} Taskr. All rights reserved.
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16"
        style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-md mx-auto animate-slide-up">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4" stroke="#0e0c0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-700 text-lg" style={{ color: "var(--text-primary)" }}>Taskr</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-700 mb-1" style={{ color: "var(--text-primary)" }}>
              Sign in
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              New here?{" "}
              <Link href="/register" className="transition-colors hover:opacity-80" style={{ color: "var(--accent)" }}>
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-500 mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Email address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "var(--surface-2)", border: `1px solid ${errors.email ? "var(--rose)" : "var(--border)"}`, color: "var(--text-primary)" }}
              />
              {errors.email && <p className="text-xs mt-1.5" style={{ color: "var(--rose)" }}>{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-500 mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); }}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "var(--surface-2)", border: `1px solid ${errors.password ? "var(--rose)" : "var(--border)"}`, color: "var(--text-primary)" }}
              />
              {errors.password && <p className="text-xs mt-1.5" style={{ color: "var(--rose)" }}>{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl text-sm transition-all"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </span>
              ) : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
