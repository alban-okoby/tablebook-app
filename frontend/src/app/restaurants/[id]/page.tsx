"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout";
import { Badge, Button, Card } from "@/components/ui";
import { BookingWidget } from "@/components/booking";
import { ReviewCard } from "@/components/restaurant/ReviewCard";
import { useRestaurant } from "@/hooks/useRestaurants";

const DAY_LABELS: Record<string, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday",
  thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { restaurant, loading, error } = useRestaurant(id);

  if (loading) {
    return (
      <div className="py-[var(--spacing-3xl)]" style={{ backgroundColor: "var(--color-canvas)" }}>
        <Container>
          <div className="h-96 rounded-[var(--radius-xl)] animate-pulse" style={{ backgroundColor: "var(--color-canvas-soft)" }} />
        </Container>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="py-[var(--spacing-3xl)]" style={{ backgroundColor: "var(--color-canvas)" }}>
        <Container>
          <Card variant="sage" className="text-center py-[var(--spacing-3xl)]">
            <p className="text-display-xs text-[var(--color-mute)] mb-[var(--spacing-md)]">🍽</p>
            <p className="text-body-md text-[var(--color-mute)]">{error ?? "Restaurant not found."}</p>
            <Link href="/restaurants" className="inline-block mt-[var(--spacing-xl)]">
              <Button variant="primary">Browse restaurants</Button>
            </Link>
          </Card>
        </Container>
      </div>
    );
  }

  const { name, description, cuisine, address, phone, email, priceRange,
          ratings, reviews, openingHours, coverImage, images } = restaurant;

  return (
    <div style={{ backgroundColor: "var(--color-canvas)" }}>
      {/* Cover */}
      <div className="relative w-full h-72 md:h-96 bg-[var(--color-canvas-soft)]">
        {coverImage ? (
          <Image src={coverImage} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-display-mega text-[var(--color-mute)]">🍽</span>
          </div>
        )}
      </div>

      <Container>
        <div className="py-[var(--spacing-3xl)]">
          <div className="flex flex-col lg:flex-row gap-[var(--spacing-3xl)]">

            {/* ── Left: main info ───────────────────── */}
            <div className="flex-1 min-w-0 flex flex-col gap-[var(--spacing-3xl)]">

              {/* Header */}
              <div className="flex flex-col gap-[var(--spacing-md)]">
                <h1 className="text-display-md text-[var(--color-ink)]">{name}</h1>
                <p className="text-body-md text-[var(--color-mute)]">
                  {[address.street, address.city, address.country].filter(Boolean).join(", ")}
                </p>
                <div className="flex flex-wrap gap-[var(--spacing-sm)]">
                  {cuisine.map((c) => <Badge key={c} variant="neutral">{c}</Badge>)}
                  <Badge variant="neutral">{priceRange}</Badge>
                  {ratings.count > 0 && (
                    <Badge variant="positive">★ {ratings.average.toFixed(1)} ({ratings.count})</Badge>
                  )}
                </div>
                {description && (
                  <p className="text-body-md text-[var(--color-body)] max-w-prose">{description}</p>
                )}
              </div>

              {/* Contact */}
              {(phone || email) && (
                <Card variant="sage">
                  <p className="text-body-sm-strong text-[var(--color-ink)] mb-[var(--spacing-md)]">Contact</p>
                  <div className="flex flex-col gap-[var(--spacing-sm)]">
                    {phone && <p className="text-body-sm text-[var(--color-body)]">📞 {phone}</p>}
                    {email && <p className="text-body-sm text-[var(--color-body)]">✉️ {email}</p>}
                  </div>
                </Card>
              )}

              {/* Opening hours */}
              {openingHours?.length > 0 && (
                <div>
                  <p className="text-body-md-strong text-[var(--color-ink)] mb-[var(--spacing-lg)]">Opening hours</p>
                  <div className="flex flex-col divide-y" style={{ borderColor: "var(--color-canvas-soft)" }}>
                    {openingHours.map(({ day, open, close, isClosed }) => (
                      <div key={day} className="flex justify-between py-[var(--spacing-md)]">
                        <span className="text-body-sm text-[var(--color-body)]">{DAY_LABELS[day]}</span>
                        <span className="text-body-sm-strong text-[var(--color-ink)]">
                          {isClosed ? "Closed" : `${open} – ${close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {images?.length > 0 && (
                <div>
                  <p className="text-body-md-strong text-[var(--color-ink)] mb-[var(--spacing-lg)]">Photos</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-[var(--spacing-md)]">
                    {images.slice(0, 6).map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-canvas-soft)]">
                        <Image src={src} alt={`${name} photo ${i + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div>
                <p className="text-body-md-strong text-[var(--color-ink)] mb-[var(--spacing-lg)]">
                  Reviews {ratings.count > 0 && <span className="text-[var(--color-mute)]">({ratings.count})</span>}
                </p>
                {reviews?.length > 0 ? (
                  <div className="flex flex-col gap-[var(--spacing-lg)]">
                    {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
                  </div>
                ) : (
                  <Card variant="sage" className="text-center">
                    <p className="text-body-md text-[var(--color-mute)]">No reviews yet. Be the first!</p>
                  </Card>
                )}
              </div>
            </div>

            {/* ── Right: sticky booking widget ──────── */}
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="lg:sticky lg:top-24">
                <BookingWidget restaurantId={id} restaurantName={name} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
