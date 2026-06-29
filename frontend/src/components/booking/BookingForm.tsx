"use client";

import { useState } from "react";
import { Input, Button } from "@/components/ui";
import { bookings as bookingsApi } from "@/lib/api";
import type { Restaurant } from "@/types/restaurant";

interface BookingFormProps {
  restaurant: Restaurant;
  prefill?: { date?: string; time?: string; partySize?: number };
  onSuccess?: (confirmationCode: string) => void;
}

const TIME_SLOTS = [
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00",
];

export function BookingForm({ restaurant, prefill, onSuccess }: BookingFormProps) {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(prefill?.date ?? "");
  const [time, setTime] = useState(prefill?.time ?? "");
  const [partySize, setPartySize] = useState(prefill?.partySize ?? 2);
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full text-body-md border border-[var(--color-ink)] rounded-[var(--radius-md)] " +
    "px-[var(--spacing-lg)] py-[var(--spacing-md)] bg-[var(--color-canvas)] " +
    "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-ink)]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await bookingsApi.create({
        restaurant: restaurant._id,
        date,
        time,
        partySize,
        specialRequests: specialRequests || undefined,
      });
      onSuccess?.(result.booking.confirmationCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--spacing-xl)]">
      {/* Restaurant name */}
      <div>
        <p className="text-caption text-[var(--color-mute)]">Booking at</p>
        <p className="text-display-xs text-[var(--color-ink)]">{restaurant.name}</p>
        <p className="text-body-sm text-[var(--color-mute)]">{restaurant.address.city}</p>
      </div>

      {/* Date */}
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <label className="text-body-sm-strong text-[var(--color-ink)]">Date *</label>
        <input
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      {/* Time + Guests */}
      <div className="flex gap-[var(--spacing-md)]">
        <div className="flex flex-col gap-[var(--spacing-xs)] flex-1">
          <label className="text-body-sm-strong text-[var(--color-ink)]">Time *</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className={inputClass}
          >
            <option value="">Select time</option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-[var(--spacing-xs)] flex-1">
          <label className="text-body-sm-strong text-[var(--color-ink)]">Guests *</label>
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

      {/* Special requests */}
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <label className="text-body-sm-strong text-[var(--color-ink)]">Special requests</label>
        <textarea
          rows={3}
          placeholder="Allergies, high chair, anniversary…"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          maxLength={500}
          className={`${inputClass} resize-none`}
        />
        <p className="text-caption text-[var(--color-mute)]">
          {specialRequests.length}/500
        </p>
      </div>

      {error && (
        <p className="text-body-sm text-[var(--color-negative)]">{error}</p>
      )}

      <Button type="submit" variant="primary" disabled={loading || !date || !time}>
        {loading ? "Reserving…" : "Confirm reservation"}
      </Button>
    </form>
  );
}
