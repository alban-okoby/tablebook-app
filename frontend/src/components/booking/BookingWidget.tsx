"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

interface BookingWidgetProps {
  restaurantId?: string;
  restaurantName?: string;
}

const TIME_SLOTS = [
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00",
];

export function BookingWidget({ restaurantId, restaurantName }: BookingWidgetProps) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(2);

  const handleSubmit = () => {
    if (!date || !time) return;

    if (restaurantId) {
      const sp = new URLSearchParams({ restaurantId, date, time, partySize: String(partySize) });
      router.push(`/bookings/new?${sp.toString()}`);
    } else {
      const sp = new URLSearchParams({ date, time, partySize: String(partySize) });
      router.push(`/restaurants?${sp.toString()}`);
    }
  };

  const inputClass =
    "w-full text-body-md border border-[var(--color-ink)] rounded-[var(--radius-md)] " +
    "px-[var(--spacing-lg)] py-[var(--spacing-md)] bg-[var(--color-canvas)] " +
    "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] " +
    "text-[var(--color-ink)]";

  return (
    <div
      className="rounded-[var(--radius-xl)] p-[var(--spacing-xl)] border border-[var(--color-ink)]"
      style={{ backgroundColor: "var(--color-canvas)" }}
    >
      {restaurantName && (
        <p className="text-caption text-[var(--color-mute)] mb-[var(--spacing-xs)]">
          Booking at
        </p>
      )}
      <p className="text-body-md-strong text-[var(--color-ink)] mb-[var(--spacing-xl)]">
        {restaurantName ?? "Find a table"}
      </p>

      <div className="flex flex-col gap-[var(--spacing-md)]">
        {/* Date */}
        <div className="flex flex-col gap-[var(--spacing-xs)]">
          <label className="text-body-sm-strong text-[var(--color-ink)]">Date</label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Time + Party size */}
        <div className="flex gap-[var(--spacing-md)]">
          <div className="flex flex-col gap-[var(--spacing-xs)] flex-1">
            <label className="text-body-sm-strong text-[var(--color-ink)]">Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputClass}
            >
              <option value="">Select time</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-[var(--spacing-xs)] flex-1">
            <label className="text-body-sm-strong text-[var(--color-ink)]">Guests</label>
            <select
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              className={inputClass}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
              ))}
            </select>
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full mt-[var(--spacing-sm)]"
          onClick={handleSubmit}
          disabled={!date || !time}
        >
          {restaurantId ? "Reserve now" : "Find a table"}
        </Button>
      </div>
    </div>
  );
}
