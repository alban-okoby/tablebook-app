"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays, faCheck, faXmark, faCircleCheck,
  faArrowLeft, faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Badge, Button } from "@/components/ui";
import { bookings as bookingsApi, restaurants as restaurantsApi } from "@/lib/api";
import type { Booking, BookingStatus } from "@/types/booking";
import type { Restaurant } from "@/types/restaurant";

const STATUS_FILTERS: { label: string; value: BookingStatus | undefined }[] = [
  { label: "All",       value: undefined    },
  { label: "Pending",   value: "pending"    },
  { label: "Confirmed", value: "confirmed"  },
  { label: "Completed", value: "completed"  },
  { label: "Cancelled", value: "cancelled"  },
];

const STATUS_VARIANT: Record<BookingStatus, "positive" | "negative" | "warning" | "neutral"> = {
  pending:   "warning",
  confirmed: "positive",
  cancelled: "negative",
  completed: "neutral",
  "no-show": "negative",
};

type Action = "confirm" | "complete" | "cancel";
type ConfirmState = { action: Action; bookingId: string } | null;

const ACTION_LABELS: Record<Action, string> = {
  confirm:  "Confirm this reservation?",
  complete: "Mark this reservation as completed?",
  cancel:   "Cancel this reservation?",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

export default function OwnerRestaurantBookingsPage() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [list, setList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeStatus, setActiveStatus] = useState<BookingStatus | undefined>(undefined);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    restaurantsApi
      .get(id)
      .then(({ restaurant }) => setRestaurant(restaurant))
      .catch(() => setError("Restaurant not found."));
  }, [id]);

  const loadBookings = useCallback(() => {
    setLoading(true);
    bookingsApi
      .forRestaurant(id, { status: activeStatus })
      .then(({ bookings }) => setList(bookings))
      .catch(() => setError("Failed to load bookings."))
      .finally(() => setLoading(false));
  }, [id, activeStatus]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  async function executeAction() {
    if (!confirm) return;
    const { action, bookingId } = confirm;
    setActing(bookingId);
    setConfirm(null);
    try {
      let updated: Booking;
      if (action === "confirm")  ({ booking: updated } = await bookingsApi.confirm(bookingId));
      else if (action === "complete") ({ booking: updated } = await bookingsApi.complete(bookingId));
      else ({ booking: updated } = await bookingsApi.cancel(bookingId));
      setList((prev) => prev.map((b) => (b._id === bookingId ? updated : b)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setActing(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/owner/restaurants">
          <button
            className="mt-1 w-8 h-8 flex items-center justify-center rounded-[var(--radius-lg)] transition-colors cursor-pointer"
            style={{ background: "var(--color-canvas)" }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 text-[var(--color-body)]" />
          </button>
        </Link>
        <div>
          <h1 className="text-display-xs text-[var(--color-ink)]">
            {restaurant ? restaurant.name : "Bookings"}
          </h1>
          <p className="text-body-sm text-[var(--color-mute)] mt-0.5">
            Manage reservations — confirm, complete, or cancel.
          </p>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
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

      {/* Confirm banner */}
      {confirm && (
        <div
          className="flex items-center justify-between gap-4 px-5 py-4 rounded-[var(--radius-xl)]"
          style={{
            background: confirm.action === "cancel" ? "var(--color-negative)" : "var(--color-ink)",
            color: "var(--color-canvas)",
          }}
        >
          <p className="text-body-sm">{ACTION_LABELS[confirm.action]}</p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={executeAction}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-lg)] text-body-sm font-semibold cursor-pointer"
              style={{ background: "var(--color-canvas)", color: "var(--color-ink)" }}
            >
              <FontAwesomeIcon icon={faCheck} className="w-3" />
              Yes, proceed
            </button>
            <button
              onClick={() => setConfirm(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-lg)] text-body-sm cursor-pointer opacity-70 hover:opacity-100"
              style={{ color: "var(--color-canvas)" }}
            >
              <FontAwesomeIcon icon={faXmark} className="w-3" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-body-sm text-[var(--color-negative)]">{error}</p>}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-[var(--radius-xl)] animate-pulse"
              style={{ background: "var(--color-canvas-soft)" }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && list.length === 0 && !error && (
        <div className="rounded-[var(--radius-xl)] p-12 text-center"
          style={{ background: "var(--color-canvas)" }}>
          <FontAwesomeIcon icon={faCalendarDays} className="text-display-xs text-[var(--color-mute)] mb-3" />
          <p className="text-body-md text-[var(--color-mute)]">
            {activeStatus ? `No ${activeStatus} reservations.` : "No reservations yet."}
          </p>
        </div>
      )}

      {/* Booking list */}
      {!loading && list.length > 0 && (
        <div className="rounded-[var(--radius-xl)] overflow-hidden"
          style={{ background: "var(--color-canvas)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {list.map((b, idx) => {
            const busy = acting === b._id;
            const customer = b.user;

            return (
              <div
                key={b._id}
                className="flex flex-wrap items-start gap-4 px-5 py-4"
                style={{
                  borderTop: idx > 0 ? "1px solid var(--color-canvas-soft)" : undefined,
                  opacity: busy ? 0.5 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {/* Date/time block */}
                <div
                  className="flex flex-col items-center justify-center w-16 h-16 rounded-[var(--radius-lg)] shrink-0 text-center"
                  style={{ background: "var(--color-canvas-soft)" }}
                >
                  <p className="text-body-sm-strong text-[var(--color-ink)] leading-tight">
                    {new Date(b.date).toLocaleDateString("en-US", { month: "short" })}
                  </p>
                  <p className="text-display-xs text-[var(--color-ink)] leading-none">
                    {new Date(b.date).getDate()}
                  </p>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant={STATUS_VARIANT[b.status]}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </Badge>
                    <span className="text-body-sm-strong text-[var(--color-ink)]">
                      {b.time} · {b.partySize} guest{b.partySize !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-caption text-[var(--color-mute)]">
                    {formatDate(b.date)}
                    {b.tableLabel ? ` · Table: ${b.tableLabel}` : ""}
                  </p>
                  {customer && (
                    <p className="text-caption text-[var(--color-mute)] flex items-center gap-1 mt-0.5">
                      <FontAwesomeIcon icon={faUser} className="w-3" />
                      {customer.username || customer.email || "Guest"}
                    </p>
                  )}
                  {b.specialRequests && (
                    <p className="text-caption text-[var(--color-mute)] mt-1 italic">
                      "{b.specialRequests}"
                    </p>
                  )}
                  <p className="text-caption text-[var(--color-mute)] mt-0.5">
                    Code: <span className="font-mono">{b.confirmationCode}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  {b.status === "pending" && (
                    <button
                      disabled={busy}
                      onClick={() => setConfirm({ action: "confirm", bookingId: b._id })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-lg)] text-caption font-semibold cursor-pointer transition-colors"
                      style={{ background: "rgba(132,204,22,0.15)", color: "var(--color-primary)" }}
                    >
                      <FontAwesomeIcon icon={faCheck} className="w-3" />
                      Confirm
                    </button>
                  )}
                  {b.status === "confirmed" && (
                    <button
                      disabled={busy}
                      onClick={() => setConfirm({ action: "complete", bookingId: b._id })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-lg)] text-caption font-semibold cursor-pointer transition-colors"
                      style={{ background: "var(--color-canvas-soft)", color: "var(--color-body)" }}
                    >
                      <FontAwesomeIcon icon={faCircleCheck} className="w-3" />
                      Complete
                    </button>
                  )}
                  {(b.status === "pending" || b.status === "confirmed") && (
                    <button
                      disabled={busy}
                      onClick={() => setConfirm({ action: "cancel", bookingId: b._id })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-lg)] text-caption cursor-pointer transition-colors"
                      style={{ background: "var(--color-canvas-soft)", color: "var(--color-negative)" }}
                    >
                      <FontAwesomeIcon icon={faXmark} className="w-3" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {list.length > 0 && (
        <p className="text-caption text-[var(--color-mute)] text-center">
          {list.length} reservation{list.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
