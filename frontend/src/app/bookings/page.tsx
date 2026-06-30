"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { Container } from "@/components/layout";
import { BookingCard } from "@/components/booking/BookingCard";
import { Button, Badge } from "@/components/ui";
import { useBookings } from "@/hooks/useBookings";
import type { BookingStatus } from "@/types/booking";

const STATUS_FILTERS: { label: string; value: BookingStatus | undefined }[] = [
  { label: "All",       value: undefined    },
  { label: "Pending",   value: "pending"    },
  { label: "Confirmed", value: "confirmed"  },
  { label: "Completed", value: "completed"  },
  { label: "Cancelled", value: "cancelled"  },
];

export default function BookingsPage() {
  const [activeStatus, setActiveStatus] = useState<BookingStatus | undefined>(undefined);
  const { bookings, loading, error, cancel } = useBookings(activeStatus);

  return (
    <div className="py-[var(--spacing-3xl)]" style={{ backgroundColor: "var(--color-canvas)" }}>
      <Container>
        <div className="flex flex-col gap-[var(--spacing-3xl)]">

          {/* Header */}
          <div className="flex items-start justify-between gap-[var(--spacing-xl)]">
            <div>
              <h1 className="text-display-md text-[var(--color-ink)]">My bookings</h1>
              <p className="text-body-md text-[var(--color-body)] mt-[var(--spacing-sm)]">
                Manage your restaurant reservations.
              </p>
            </div>
            <Link href="/restaurants">
              <Button variant="primary">New reservation</Button>
            </Link>
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-[var(--spacing-sm)]">
            {STATUS_FILTERS.map(({ label, value }) => (
              <button
                key={label}
                onClick={() => setActiveStatus(value)}
                className="text-body-sm-strong rounded-[var(--radius-pill)] px-[var(--spacing-lg)] py-[var(--spacing-xs)] border transition-colors cursor-pointer"
                style={{
                  backgroundColor: activeStatus === value ? "var(--color-ink)" : "var(--color-canvas)",
                  color:           activeStatus === value ? "var(--color-canvas)" : "var(--color-ink)",
                  borderColor:     activeStatus === value ? "var(--color-ink)"    : "var(--color-canvas-soft)",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading && (
            <div className="flex flex-col gap-[var(--spacing-lg)]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-36 rounded-[var(--radius-xl)] animate-pulse" style={{ backgroundColor: "var(--color-canvas-soft)" }} />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-[var(--radius-xl)] p-[var(--spacing-xl)] text-center" style={{ backgroundColor: "var(--color-canvas-soft)" }}>
              <p className="text-body-md text-[var(--color-negative)]">{error}</p>
              <Link href="/auth/login" className="inline-block mt-[var(--spacing-lg)]">
                <Button variant="primary">Sign in to view bookings</Button>
              </Link>
            </div>
          )}

          {!loading && !error && bookings.length === 0 && (
            <div className="rounded-[var(--radius-xl)] p-[var(--spacing-3xl)] text-center" style={{ backgroundColor: "var(--color-canvas-soft)" }}>
              <FontAwesomeIcon icon={faCalendarDays} className="text-display-xs text-[var(--color-mute)] mb-[var(--spacing-sm)]" />
              <p className="text-body-md text-[var(--color-mute)] mb-[var(--spacing-xl)]">
                {activeStatus ? `No ${activeStatus} bookings.` : "You have no bookings yet."}
              </p>
              <Link href="/restaurants">
                <Button variant="primary">Find a restaurant</Button>
              </Link>
            </div>
          )}

          {!loading && !error && bookings.length > 0 && (
            <div className="flex flex-col gap-[var(--spacing-lg)]">
              {bookings.map((b) => (
                <BookingCard key={b._id} booking={b} onCancel={cancel} />
              ))}
              <p className="text-caption text-[var(--color-mute)] text-center">
                {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
