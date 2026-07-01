"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faCalendarDays, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";

const QUICK_LINKS = [
  {
    icon: faPlus,
    label: "Add a restaurant",
    description: "Create a new listing for your venue",
    href: "/owner/restaurants/new",
    cta: "Add restaurant",
  },
  {
    icon: faUtensils,
    label: "My restaurants",
    description: "Manage your venues, visibility, and details",
    href: "/owner/restaurants",
    cta: "Manage",
  },
  {
    icon: faCalendarDays,
    label: "Reservations",
    description: "View bookings — select a restaurant to manage them",
    href: "/owner/restaurants",
    cta: "View restaurants",
  },
];

export default function OwnerPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-display-xs text-[var(--color-ink)]">
          Welcome back{user ? `, ${user.username}` : ""}
        </h1>
        <p className="text-body-md text-[var(--color-body)] mt-1">
          Manage your restaurants and reservations from here.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_LINKS.map(({ icon, label, description, href, cta }) => (
          <div
            key={href + label}
            className="rounded-[var(--radius-xl)] p-6 flex flex-col gap-4"
            style={{
              background: "var(--color-canvas)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center"
              style={{ background: "var(--color-canvas-soft)" }}
            >
              <FontAwesomeIcon icon={icon} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-body-md-strong text-[var(--color-ink)]">{label}</p>
              <p className="text-body-sm text-[var(--color-mute)] mt-0.5">{description}</p>
            </div>
            <Link
              href={href}
              className="mt-auto text-body-sm-strong text-[var(--color-primary)] hover:underline"
            >
              {cta} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
