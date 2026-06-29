"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Button, Card } from "@/components/ui";
import { auth } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await auth.login({ email, password });
      localStorage.setItem("token", token);
      router.push("/bookings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      variant="sage"
      className="w-full max-w-md mx-auto"
    >
      <h1 className="text-display-sm text-[var(--color-ink)] mb-[var(--spacing-2xl)]">
        Sign in
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--spacing-lg)]">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && (
          <p className="text-body-sm text-[var(--color-negative)]">{error}</p>
        )}

        <Button type="submit" variant="primary" disabled={loading} className="w-full mt-[var(--spacing-sm)]">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-body-sm text-[var(--color-body)] text-center mt-[var(--spacing-xl)]">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-body-sm-strong text-[var(--color-ink)] underline">
          Create one
        </Link>
      </p>
    </Card>
  );
}
