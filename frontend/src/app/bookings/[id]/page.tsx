"use client";

import { use, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Container } from "@/components/layout";
import { Badge, Button, Card } from "@/components/ui";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { useBooking } from "@/hooks/useBookings";
import type { BookingStatus } from "@/types/booking";

const statusVariant: Record<BookingStatus, "positive" | "negative" | "warning" | "neutral"> = {
  pending:   "warning",
  confirmed: "positive",
  cancelled: "negative",
  completed: "neutral",
  "no-show": "negative",
};

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { booking, loading, error, cancel } = useBooking(id);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(true);
    setCancelError("");
    try {
      await cancel();
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Failed to cancel.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="py-[var(--spacing-3xl)]" style={{ backgroundColor: "var(--color-canvas)" }}>
        <Container>
          <div className="h-96 rounded-[var(--radius-xl)] animate-pulse" style={{ backgroundColor: "var(--color-canvas-soft)" }} />
        </Container>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="py-[var(--spacing-3xl)]" style={{ backgroundColor: "var(--color-canvas)" }}>
        <Container>
          <Card variant="sage" className="text-center py-[var(--spacing-3xl)]">
            <p className="text-body-md text-[var(--color-mute)] mb-[var(--spacing-xl)]">
              {error ?? "Booking not found."}
            </p>
            <Link href="/bookings">
              <Button variant="primary">Back to bookings</Button>
            </Link>
          </Card>
        </Container>
      </div>
    );
  }

  const { restaurant, date, time, partySize, status, specialRequests, confirmationCode } = booking;
  const canCancel = status === "pending" || status === "confirmed";

  return (
    <div className="py-[var(--spacing-3xl)]" style={{ backgroundColor: "var(--color-canvas)" }}>
      <Container>
        <div className="max-w-[672px] mx-auto flex flex-col gap-[var(--spacing-3xl)]">

          {/* Back */}
          <Link href="/bookings">
            <Button variant="secondary">← My bookings</Button>
          </Link>

          {/* Status header */}
          <div className="flex items-center justify-between">
            <h1 className="text-display-sm text-[var(--color-ink)]">Booking details</h1>
            <Badge variant={statusVariant[status]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>

          {/* Summary card */}
          <BookingSummary
            confirmationCode={confirmationCode}
            restaurantName={restaurant.name}
            date={date}
            time={time}
            partySize={partySize}
            specialRequests={specialRequests}
          />

          {/* Restaurant contact */}
          <Card variant="sage" className="flex flex-col gap-[var(--spacing-sm)]">
            <p className="text-body-sm-strong text-[var(--color-ink)]">Restaurant</p>
            <Link href={`/restaurants/${restaurant._id}`} className="text-body-md-strong text-[var(--color-ink)] underline">
              {restaurant.name}
            </Link>
            <p className="text-body-sm text-[var(--color-mute)]">{restaurant.address.city}</p>
            {restaurant.phone && (
              <p className="text-body-sm text-[var(--color-body)] flex items-center gap-[var(--spacing-sm)]">
                <FontAwesomeIcon icon={faPhone} className="w-4 text-[var(--color-mute)]" /> {restaurant.phone}
              </p>
            )}
            {restaurant.email && (
              <p className="text-body-sm text-[var(--color-body)] flex items-center gap-[var(--spacing-sm)]">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 text-[var(--color-mute)]" /> {restaurant.email}
              </p>
            )}
          </Card>

          {/* Cancel action */}
          {canCancel && (
            <div className="flex flex-col gap-[var(--spacing-sm)]">
              {cancelError && (
                <p className="text-body-sm text-[var(--color-negative)]">{cancelError}</p>
              )}
              <Button variant="tertiary" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? "Cancelling…" : "Cancel this booking"}
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
