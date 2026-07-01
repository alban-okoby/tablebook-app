"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button, Input } from "@/components/ui";
import { restaurants as api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { Review } from "@/types/restaurant";

interface Props {
  restaurantId: string;
  alreadyReviewed: boolean;
  onSuccess: (reviews: Review[], ratings: { average: number; count: number }) => void;
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="cursor-pointer text-display-xs transition-colors"
          style={{ color: star <= display ? "var(--color-primary)" : "var(--color-mute)" }}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <FontAwesomeIcon icon={faStar} />
        </button>
      ))}
    </div>
  );
}

export function ReviewForm({ restaurantId, alreadyReviewed, onSuccess }: Props) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!isAuthenticated) {
    return (
      <div
        className="rounded-[var(--radius-xl)] p-[var(--spacing-xl)] text-center"
        style={{ background: "var(--color-canvas-soft)" }}
      >
        <p className="text-body-md text-[var(--color-body)] mb-[var(--spacing-lg)]">
          Sign in to leave a review.
        </p>
        <Link href="/auth/login">
          <Button variant="primary">Sign in</Button>
        </Link>
      </div>
    );
  }

  if (alreadyReviewed || done) {
    return (
      <div
        className="rounded-[var(--radius-xl)] p-[var(--spacing-xl)] text-center"
        style={{ background: "var(--color-canvas-soft)" }}
      >
        <p className="text-body-md text-[var(--color-body)]">
          {done ? "Thanks for your review!" : "You've already reviewed this restaurant."}
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (body.trim().length < 10) { setError("Review must be at least 10 characters."); return; }
    setError("");
    setLoading(true);
    try {
      const { reviews, ratings } = await api.addReview(restaurantId, {
        rating,
        body: body.trim(),
        title: title.trim() || undefined,
      });
      onSuccess(reviews, ratings);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[var(--radius-xl)] p-[var(--spacing-xl)] flex flex-col gap-[var(--spacing-lg)]"
      style={{ background: "var(--color-canvas-soft)" }}
    >
      <p className="text-body-md-strong text-[var(--color-ink)]">Write a review</p>

      {/* Star rating */}
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <label className="text-body-sm-strong text-[var(--color-ink)]">Rating *</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      {/* Title */}
      <Input
        label="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Sum it up in a few words"
        maxLength={100}
      />

      {/* Body */}
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <label className="text-body-sm-strong text-[var(--color-ink)]">Your review *</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={2000}
          required
          placeholder="Share your experience — food, service, atmosphere…"
          className="w-full text-body-md text-[var(--color-ink)] border rounded-[var(--radius-md)] px-[var(--spacing-lg)] py-[var(--spacing-md)] placeholder:text-[var(--color-mute)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
          style={{
            background: "var(--color-canvas)",
            borderColor: "var(--color-canvas-soft)",
          }}
        />
        <p className="text-caption text-[var(--color-mute)] self-end">{body.length}/2000</p>
      </div>

      {error && <p className="text-body-sm text-[var(--color-negative)]">{error}</p>}

      <Button type="submit" variant="primary" disabled={loading} className="self-start">
        {loading ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}
