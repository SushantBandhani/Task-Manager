"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName:"", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName || form.firstName.length < 3) e.username = "Firstname must be at least 3 characters";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password || form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
      toast.success("Account created!");
      router.push("/login");
    } catch (err) {
    const msg = (err as AxiosError<{ errorMessage: string }>)?.response?.data?.errorMessage || "Registration failed";      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm font-500 mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: "" }); }}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm"
        style={{ background: "var(--surface-2)", border: `1px solid ${errors[key] ? "var(--rose)" : "var(--border)"}`, color: "var(--text-primary)" }}
      />
      {errors[key] && <p className="text-xs mt-1.5" style={{ color: "var(--rose)" }}>{errors[key]}</p>}
    </div>
  );

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

        <div className="relative flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4" stroke="#0e0c0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display font-700 text-xl" style={{ color: "var(--text-primary)" }}>Taskr</span>
        </div>

        <div className="relative space-y-8">
          <h1 className="font-display text-5xl font-800 leading-tight" style={{ color: "var(--text-primary)" }}>
            Your journey<br />
            to <span className="text-gradient">zero inbox</span><br />
            starts now.
          </h1>
          <div className="space-y-4">
            {[
              { icon: "✦", text: "Organize tasks with status tracking" },
              { icon: "✦", text: "Filter and search instantly" },
              { icon: "✦", text: "Stay on top of due dates" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span style={{ color: "var(--accent)", fontSize: "10px" }}>{item.icon}</span>
                <span style={{ color: "var(--text-secondary)" }}>{item.text}</span>
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
              Create account
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Already have one?{" "}
              <Link href="/login" className="transition-colors hover:opacity-80" style={{ color: "var(--accent)" }}>
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {field("firstName", "Firstname", "text", "john")}
            {field("lastName", "Lastname", "text", "doe")}
            {field("email", "Email address", "email", "you@example.com")}
            {field("password", "Password", "password", "Min. 8 characters")}
            {field("confirm", "Confirm password", "password", "Repeat password")}

            <div className="pt-1">
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
                    Creating account…
                  </span>
                ) : "Create account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
