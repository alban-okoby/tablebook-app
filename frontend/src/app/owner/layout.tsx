"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Container } from "@/components/layout";

const NAV = [
  { label: "Overview", href: "/owner" },
  { label: "My Restaurants", href: "/owner/restaurants" },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { isOwner, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isOwner) router.replace("/");
  }, [loading, isOwner, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!isOwner) return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-canvas-soft)" }}>
      <div style={{ background: "#1a3a2a" }}>
        <Container>
          <div className="flex items-center gap-6 py-3">
            <span className="text-body-sm-strong" style={{ color: "var(--color-canvas)" }}>
              Owner
            </span>
            <span className="w-px h-4 opacity-30" style={{ background: "var(--color-canvas)" }} />
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-sm transition-colors"
                style={{
                  color:
                    pathname === item.href
                      ? "var(--color-primary)"
                      : "var(--color-canvas-soft)",
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="ml-auto text-body-sm"
              style={{ color: "var(--color-canvas-soft)" }}
            >
              ← Back to site
            </Link>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8">{children}</div>
      </Container>
    </div>
  );
}
