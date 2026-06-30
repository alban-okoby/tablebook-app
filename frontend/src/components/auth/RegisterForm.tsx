"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/ui";
import { auth } from "@/lib/api";
import { setToken } from "@/lib/auth-token";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await auth.register({
        username: form.username,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });
      setToken(token);
      router.push("/bookings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Green accent bar */}
      <div
        className="h-1.5 rounded-t-[var(--radius-xl)]"
        style={{ background: "var(--color-primary)" }}
      />

      {/* Card body */}
      <div
        className="rounded-b-[var(--radius-xl)] px-8 py-8"
        style={{
          background: "var(--color-canvas)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
          border: "1px solid var(--color-canvas-soft)",
          borderTop: "none",
        }}
      >
        <div className="mb-8">
          <h1 className="text-display-sm text-[var(--color-ink)] mb-1">
            Create an account
          </h1>
          <p className="text-body-md text-[var(--color-body)]">
            Join TableBook and start reserving tables today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Username"
            placeholder="yourname"
            value={form.username}
            onChange={set("username")}
            required
            autoComplete="username"
            hint="3–30 characters, letters, numbers and underscores only."
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set("email")}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={set("password")}
            required
            autoComplete="new-password"
            hint="Must include uppercase, lowercase, and a number."
          />
          <Input
            label="Phone (optional)"
            type="tel"
            placeholder="+1 555 000 0000"
            value={form.phone}
            onChange={set("phone")}
            autoComplete="tel"
          />

          {error && (
            <p className="text-body-sm text-[var(--color-negative)]">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-1"
          >
            {loading ? "Creating account…" : "Get started"}
          </Button>
        </form>

        <p className="text-body-sm text-[var(--color-body)] text-center mt-6">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-body-sm-strong text-[var(--color-ink)] underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
