"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faClock, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Badge, Button, Card } from "@/components/ui";
import type { Booking, BookingStatus } from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
}

const statusVariant: Record<BookingStatus, "positive" | "negative" | "warning" | "neutral"> = {
  pending:   "warning",
  confirmed: "positive",
  cancelled: "negative",
  completed: "neutral",
  "no-show": "negative",
};

const statusLabel: Record<BookingStatus, string> = {
  pending:   "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
  "no-show": "No-show",
};

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const { _id, restaurant, date, time, partySize, status, confirmationCode } = booking;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const canCancel = status === "pending" || status === "confirmed";

  return (
    <Card variant="content" className="flex flex-col sm:flex-row gap-[var(--spacing-xl)]">
      {/* Left: restaurant info */}
      <div className="flex-1 flex flex-col gap-[var(--spacing-sm)]">
        <div className="flex items-start justify-between gap-[var(--spacing-md)]">
          <div>
            <p className="text-body-md-strong text-[var(--color-ink)]">{restaurant.name}</p>
            <p className="text-body-sm text-[var(--color-mute)]">{restaurant.address.city}</p>
          </div>
          <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>
        </div>

        <div className="flex flex-wrap gap-[var(--spacing-md)] text-body-sm text-[var(--color-body)]">
          <span className="flex items-center gap-[var(--spacing-xs)]">
            <FontAwesomeIcon icon={faCalendarDays} className="text-[var(--color-mute)]" /> {formattedDate}
          </span>
          <span className="flex items-center gap-[var(--spacing-xs)]">
            <FontAwesomeIcon icon={faClock} className="text-[var(--color-mute)]" /> {time}
          </span>
          <span className="flex items-center gap-[var(--spacing-xs)]">
            <FontAwesomeIcon icon={faUsers} className="text-[var(--color-mute)]" /> {partySize} {partySize === 1 ? "guest" : "guests"}
          </span>
        </div>

        <p className="text-caption text-[var(--color-mute)]">
          Confirmation: <span className="text-body-sm-strong text-[var(--color-ink)]">{confirmationCode}</span>
        </p>
      </div>

      {/* Right: actions */}
      <div className="flex sm:flex-col gap-[var(--spacing-sm)] shrink-0">
        <Link href={`/bookings/${_id}`}>
          <Button variant="secondary" className="w-full">View details</Button>
        </Link>
        {canCancel && onCancel && (
          <Button
            variant="tertiary"
            className="w-full"
            onClick={() => onCancel(_id)}
          >
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
}
