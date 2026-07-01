"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils, faPlus, faPen, faCalendarDays,
  faEye, faEyeSlash, faCheck, faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Badge } from "@/components/ui";
import { restaurants as restaurantsApi } from "@/lib/api";
import type { Restaurant } from "@/types/restaurant";

type ConfirmState = { type: "hide" | "show"; id: string } | null;

export default function OwnerRestaurantsPage() {
  const [list, setList] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    restaurantsApi
      .mine()
      .then(({ restaurants }) => setList(restaurants))
      .catch(() => setError("Failed to load your restaurants."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleToggleVisibility(r: Restaurant) {
    setActing(r._id);
    try {
      const { restaurant: updated } = await restaurantsApi.update(r._id, { isApproved: !r.isApproved });
      setList((prev) => prev.map((x) => (x._id === r._id ? updated : x)));
    } catch {
      setError("Failed to update visibility.");
    } finally {
      setActing(null);
      setConfirm(null);
    }
  }

  async function executeConfirm() {
    if (!confirm) return;
    const r = list.find((x) => x._id === confirm.id);
    if (!r) return;
    await handleToggleVisibility(r);
  }

  const CONFIRM_MESSAGES: Record<NonNullable<ConfirmState>["type"], string> = {
    hide: "Hide this restaurant from the public site?",
    show: "Make this restaurant visible on the public site?",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-xs text-[var(--color-ink)]">My restaurants</h1>
          <p className="text-body-sm text-[var(--color-mute)] mt-0.5">
            {loading ? "Loading…" : `${list.length} restaurant${list.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link href="/owner/restaurants/new">
          <Button variant="primary">
            <FontAwesomeIcon icon={faPlus} />
            New restaurant
          </Button>
        </Link>
      </div>

      {/* Confirm banner */}
      {confirm && (
        <div
          className="flex items-center justify-between gap-4 px-5 py-4 rounded-[var(--radius-xl)]"
          style={{ background: "var(--color-ink)", color: "var(--color-canvas)" }}
        >
          <p className="text-body-sm">{CONFIRM_MESSAGES[confirm.type]}</p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={executeConfirm}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-lg)] text-body-sm font-semibold cursor-pointer"
              style={{ background: "var(--color-canvas)", color: "var(--color-ink)" }}
            >
              <FontAwesomeIcon icon={faCheck} className="w-3" />
              Confirm
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

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-[var(--radius-xl)] animate-pulse"
              style={{ background: "var(--color-canvas-soft)" }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && list.length === 0 && !error && (
        <div className="rounded-[var(--radius-xl)] p-12 text-center"
          style={{ background: "var(--color-canvas)" }}>
          <FontAwesomeIcon icon={faUtensils} className="text-display-xs text-[var(--color-mute)] mb-3" />
          <p className="text-body-md text-[var(--color-mute)]">You haven't added any restaurants yet.</p>
          <Link href="/owner/restaurants/new" className="mt-4 inline-block">
            <Button variant="primary">Add your first restaurant</Button>
          </Link>
        </div>
      )}

      {/* List */}
      {!loading && list.length > 0 && (
        <div className="rounded-[var(--radius-xl)] overflow-hidden"
          style={{ background: "var(--color-canvas)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {list.map((r, idx) => {
            const busy = acting === r._id;
            const isConfirmTarget = confirm?.id === r._id;

            return (
              <div
                key={r._id}
                className="flex flex-wrap items-center gap-3 px-5 py-4"
                style={{
                  borderTop: idx > 0 ? "1px solid var(--color-canvas-soft)" : undefined,
                  opacity: busy ? 0.5 : 1,
                  transition: "opacity 0.15s",
                  background: isConfirmTarget ? "var(--color-canvas-soft)" : undefined,
                }}
              >
                {/* Thumbnail */}
                <div
                  className="w-11 h-11 rounded-[var(--radius-lg)] shrink-0 flex items-center justify-center overflow-hidden"
                  style={{ background: "var(--color-canvas-soft)" }}
                >
                  {r.coverImage ? (
                    <img src={r.coverImage} alt={r.name} className="w-full h-full object-cover" />
                  ) : (
                    <FontAwesomeIcon icon={faUtensils} className="text-[var(--color-mute)]" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-body-sm-strong text-[var(--color-ink)] truncate">{r.name}</p>
                    {r.isApproved ? (
                      <Badge variant="positive">Visible</Badge>
                    ) : (
                      <Badge variant="warning">Hidden</Badge>
                    )}
                  </div>
                  <p className="text-caption text-[var(--color-mute)]">
                    {r.address.city}{r.address.country !== "US" ? `, ${r.address.country}` : ""}
                    {" · "}{r.priceRange}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  {/* Visibility toggle */}
                  <button
                    disabled={busy}
                    onClick={() => setConfirm({ type: r.isApproved ? "hide" : "show", id: r._id })}
                    title={r.isApproved ? "Hide from site" : "Publish to site"}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-lg)] text-caption transition-colors cursor-pointer"
                    style={{
                      background: r.isApproved ? "var(--color-canvas-soft)" : "rgba(132,204,22,0.12)",
                      color: r.isApproved ? "var(--color-body)" : "var(--color-primary)",
                    }}
                  >
                    <FontAwesomeIcon icon={r.isApproved ? faEye : faEyeSlash} className="w-3" />
                    {r.isApproved ? "Visible" : "Hidden"}
                  </button>

                  {/* Bookings */}
                  <Link href={`/owner/restaurants/${r._id}/bookings`}>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-lg)] text-caption cursor-pointer"
                      style={{ background: "var(--color-canvas-soft)", color: "var(--color-body)" }}
                    >
                      <FontAwesomeIcon icon={faCalendarDays} className="w-3" />
                      Bookings
                    </button>
                  </Link>

                  {/* Edit */}
                  <Link href={`/owner/restaurants/${r._id}/edit`}>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-lg)] text-caption cursor-pointer"
                      style={{ background: "var(--color-canvas-soft)", color: "var(--color-body)" }}
                    >
                      <FontAwesomeIcon icon={faPen} className="w-3" />
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
