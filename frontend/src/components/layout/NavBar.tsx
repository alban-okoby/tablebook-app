"use client";

import Link from "next/link";
import { Container } from "./Container";
import { Button } from "@/components/ui";

const navLinks = [
  { label: "Restaurants", href: "/restaurants" },
  { label: "Cuisines", href: "/restaurants?filter=cuisine" },
  { label: "My Bookings", href: "/bookings" },
];

export function NavBar() {
  return (
    <header
      className="sticky top-0 z-50 bg-[var(--color-canvas)] border-b border-[var(--color-canvas-soft)]"
    >
      <Container>
        <nav className="flex items-center justify-between py-[var(--spacing-md)]">
          {/* Logo */}
          <Link
            href="/"
            className="text-display-xs text-[var(--color-ink)] hover:opacity-80 transition-opacity"
          >
            Table<span style={{ color: "var(--color-primary)" }}>Book</span>
          </Link>

          {/* Nav links — hidden on mobile */}
          <ul className="hidden md:flex items-center gap-[var(--spacing-2xl)]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-body-sm-strong text-[var(--color-ink)] hover:text-[var(--color-body)] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth actions */}
          <div className="flex items-center gap-[var(--spacing-md)]">
            <Link href="/auth/login">
              <Button variant="tertiary">Sign in</Button>
            </Link>
            <Link href="/auth/register" className="hidden sm:inline-flex">
              <Button variant="primary">Get started</Button>
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}
