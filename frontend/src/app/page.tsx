import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faGift, faArrowsRotate, faUtensils, faStar } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Button, Badge, Card } from "@/components/ui";
import { HeroBand, ContentBand } from "@/components/bands";
import { BookingWidget } from "@/components/booking";

// Placeholder featured restaurants (replaced by real API in Phase 4)
const FEATURED = [
  { id: "1", name: "Maison Dorée",  cuisine: "French",   price: "$$$", rating: 4.8, city: "Paris",  reviews: 142 },
  { id: "2", name: "Sakura",        cuisine: "Japanese",  price: "$$",  rating: 4.6, city: "Tokyo",  reviews: 98  },
  { id: "3", name: "La Pergola",    cuisine: "Italian",   price: "$$$$",rating: 4.9, city: "Rome",   reviews: 211 },
];

const FEATURES: { variant: "dark" | "green" | "sage"; icon: IconDefinition; title: string; body: string }[] = [
  {
    variant: "dark",
    icon: faBolt,
    title: "Instant confirmation",
    body: "No waiting, no phone calls. Your table is confirmed in seconds.",
  },
  {
    variant: "green",
    icon: faGift,
    title: "Zero booking fees",
    body: "We never charge you to make a reservation. Always completely free.",
  },
  {
    variant: "sage",
    icon: faArrowsRotate,
    title: "Easy cancellation",
    body: "Plans change. Cancel your booking up to 2 hours before arrival.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <HeroBand
        headline={
          <>
            Your perfect<br />
            <span style={{ color: "var(--color-primary)" }}>table awaits.</span>
          </>
        }
        subtext="Discover and reserve tables at the finest restaurants — in seconds, with no fees."
        cta={
          <>
            <Link href="/restaurants">
              <Button variant="primary">Browse restaurants</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="secondary">Get started free</Button>
            </Link>
          </>
        }
        widget={<BookingWidget />}
      />

      {/* ── Featured restaurants ───────────────────────────────── */}
      <ContentBand
        headline="Featured restaurants"
        subtext="Handpicked tables at the most acclaimed dining spots."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-xl)]">
          {FEATURED.map((r) => (
            <Card key={r.id} variant="content" className="flex flex-col gap-[var(--spacing-md)]">
              <div
                className="w-full h-44 rounded-[var(--radius-lg)] flex items-center justify-center"
                style={{ backgroundColor: "var(--color-canvas-soft)" }}
              >
                <FontAwesomeIcon icon={faUtensils} className="text-display-md text-[var(--color-mute)]" />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-body-md-strong text-[var(--color-ink)]">{r.name}</p>
                  <p className="text-body-sm text-[var(--color-mute)]">{r.city}</p>
                </div>
                <Badge variant="positive">
                  <FontAwesomeIcon icon={faStar} className="mr-1" /> {r.rating}
                </Badge>
              </div>
              <div className="flex items-center gap-[var(--spacing-xs)]">
                <Badge variant="neutral">{r.cuisine}</Badge>
                <Badge variant="neutral">{r.price}</Badge>
                <span className="text-caption text-[var(--color-mute)]">{r.reviews} reviews</span>
              </div>
              <Link href={`/restaurants/${r.id}`} className="mt-auto">
                <Button variant="primary" className="w-full">Reserve a table</Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-[var(--spacing-3xl)] text-center">
          <Link href="/restaurants">
            <Button variant="tertiary">View all restaurants</Button>
          </Link>
        </div>
      </ContentBand>

      {/* ── Feature strip ──────────────────────────────────────── */}
      <ContentBand soft>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-xl)]">
          {FEATURES.map(({ variant, icon, title, body }) => (
            <Card key={title} variant={variant} className="flex flex-col gap-[var(--spacing-md)]">
              <FontAwesomeIcon icon={icon} className="text-display-xs" />
              <p className="text-display-xs">{title}</p>
              <p
                className="text-body-sm"
                style={{
                  color: variant === "dark"
                    ? "var(--color-canvas-soft)"
                    : "var(--color-body)",
                }}
              >
                {body}
              </p>
            </Card>
          ))}
        </div>
      </ContentBand>

      {/* ── Dark CTA band ──────────────────────────────────────── */}
      <HeroBand
        dark
        headline="Ready to book your next meal?"
        subtext="Join thousands of diners who reserve their tables with TableBook every day."
        cta={
          <Link href="/auth/register">
            <Button variant="primary">Create free account</Button>
          </Link>
        }
      />
    </>
  );
}
