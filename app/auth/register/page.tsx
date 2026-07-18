"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error ?? "Registration failed");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      toast.error("Account created — please sign in");
      router.push("/auth/login");
      return;
    }

    toast.success("Welcome to GlowCart!");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Create Account</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Full Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-rose-light px-4 py-2.5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-rose-light px-4 py-2.5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="0244000000"
            className="w-full rounded-lg border border-rose-light px-4 py-2.5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-rose-light px-4 py-2.5"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-rose-primary py-3 font-semibold text-white hover:bg-rose-primary/90 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-rose-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
