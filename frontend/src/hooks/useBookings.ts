"use client";

import { useState, useEffect, useCallback } from "react";
import { bookings as api } from "@/lib/api";
import type { Booking, BookingStatus } from "@/types/booking";

export function useBookings(status?: BookingStatus) {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = useCallback(() => {
    setLoading(true);
    setError("");
    api.list({ status })
      .then(({ bookings }) => setData(bookings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => { fetch(); }, [fetch]);

  const cancel = useCallback(async (id: string, reason?: string) => {
    await api.cancel(id, reason);
    fetch();
  }, [fetch]);

  return { bookings: data, loading, error, refetch: fetch, cancel };
}

export function useBooking(id: string) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api.get(id)
      .then(({ booking }) => setBooking(booking))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const cancel = useCallback(async (reason?: string) => {
    if (!booking) return;
    const { booking: updated } = await api.cancel(booking._id, reason);
    setBooking(updated);
  }, [booking]);

  return { booking, loading, error, cancel };
}
