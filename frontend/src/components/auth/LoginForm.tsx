"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/ui";
import { auth } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/" }: Props) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await auth.login({ email, password });
      login(token, user); // updates AuthContext → NavBar refreshes immediately
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials.");
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
            Welcome back
          </h1>
          <p className="text-body-md text-[var(--color-body)]">
            Sign in to continue to TableBook.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-1"
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-body-sm text-[var(--color-body)] text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-body-sm-strong text-[var(--color-ink)] underline underline-offset-2"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
