"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Container } from "@/components/layout";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { Card } from "@/components/ui";
import { restaurants as api } from "@/lib/api";
import type { Restaurant } from "@/types/restaurant";

function NewBookingContent() {
  const sp = useSearchParams();
  const router = useRouter();

  const restaurantId = sp.get("restaurantId") ?? "";
  const prefill = {
    date:      sp.get("date")      ?? undefined,
    time:      sp.get("time")      ?? undefined,
    partySize: sp.get("partySize") ? Number(sp.get("partySize")) : undefined,
  };

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState<{
    code: string; date: string; time: string; partySize: number;
  } | null>(null);

  useEffect(() => {
    if (!restaurantId) { router.push("/restaurants"); return; }
    api.get(restaurantId)
      .then(({ restaurant }) => setRestaurant(restaurant))
      .catch(() => router.push("/restaurants"))
      .finally(() => setLoading(false));
  }, [restaurantId, router]);

  if (loading) {
    return (
      <div className="h-96 rounded-[var(--radius-xl)] animate-pulse" style={{ backgroundColor: "var(--color-canvas-soft)" }} />
    );
  }

  if (!restaurant) return null;

  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto flex flex-col gap-[var(--spacing-xl)]">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faCheck}
            className="text-display-xl"
            style={{ color: "var(--color-primary)" }}
          />
          <h1 className="text-display-sm text-[var(--color-ink)] mt-[var(--spacing-md)]">
            You&apos;re booked!
          </h1>
          <p className="text-body-md text-[var(--color-body)] mt-[var(--spacing-sm)]">
            Your reservation is pending confirmation from the restaurant.
          </p>
        </div>
        <BookingSummary
          confirmationCode={confirmed.code}
          restaurantName={restaurant.name}
          date={confirmed.date}
          time={confirmed.time}
          partySize={confirmed.partySize}
        />
        <a href="/bookings" className="block">
          <button
            className="w-full text-button-md rounded-[var(--radius-xl)] px-[var(--spacing-xl)] py-[var(--spacing-md)] transition-colors"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" }}
          >
            View my bookings
          </button>
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-[var(--spacing-3xl)]">
      <Card variant="content">
        <BookingForm
          restaurant={restaurant}
          prefill={prefill}
          onSuccess={(code) =>
            setConfirmed({
              code,
              date: prefill.date ?? "",
              time: prefill.time ?? "",
              partySize: prefill.partySize ?? 2,
            })
          }
        />
      </Card>

      {/* Side summary */}
      <div className="hidden lg:block">
        <Card variant="sage" className="flex flex-col gap-[var(--spacing-md)]">
          <p className="text-body-sm-strong text-[var(--color-ink)]">You&apos;re booking at</p>
          <p className="text-display-xs text-[var(--color-ink)]">{restaurant.name}</p>
          <p className="text-body-sm text-[var(--color-mute)]">{restaurant.address.city}</p>
          {restaurant.phone && (
            <p className="text-body-sm text-[var(--color-body)] flex items-center gap-[var(--spacing-sm)]">
              <FontAwesomeIcon icon={faPhone} className="w-4 text-[var(--color-mute)]" /> {restaurant.phone}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <div className="py-[var(--spacing-3xl)]" style={{ backgroundColor: "var(--color-canvas)" }}>
      <Container>
        <h1 className="text-display-md text-[var(--color-ink)] mb-[var(--spacing-3xl)]">
          Reserve a table
        </h1>
        <Suspense fallback={
          <div className="h-96 rounded-[var(--radius-xl)] animate-pulse bg-[var(--color-canvas-soft)]" />
        }>
          <NewBookingContent />
        </Suspense>
      </Container>
    </div>
  );
}
