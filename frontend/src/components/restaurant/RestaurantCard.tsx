import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faStar } from "@fortawesome/free-solid-svg-icons";
import { Card, Badge, Button } from "@/components/ui";
import type { Restaurant } from "@/types/restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { _id, name, address, cuisine, priceRange, ratings, coverImage, isFeatured } = restaurant;

  return (
    <Card variant="content" className="flex flex-col gap-[var(--spacing-md)] group">
      {/* Cover image */}
      <div className="relative w-full h-44 rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-canvas-soft)]">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FontAwesomeIcon icon={faUtensils} className="text-display-md text-[var(--color-mute)]" />
          </div>
        )}
        {isFeatured && (
          <div className="absolute top-[var(--spacing-sm)] left-[var(--spacing-sm)]">
            <Badge variant="positive">Featured</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-[var(--spacing-sm)]">
        <div className="min-w-0">
          <p className="text-body-md-strong text-[var(--color-ink)] truncate">{name}</p>
          <p className="text-body-sm text-[var(--color-mute)]">
            {address.city}{address.country !== "US" ? `, ${address.country}` : ""}
          </p>
        </div>
        {ratings.count > 0 && (
          <Badge variant="positive" className="shrink-0">
            <FontAwesomeIcon icon={faStar} className="mr-1" /> {ratings.average.toFixed(1)}
          </Badge>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-[var(--spacing-xs)]">
        {cuisine.slice(0, 2).map((c) => (
          <Badge key={c} variant="neutral">{c}</Badge>
        ))}
        <Badge variant="neutral">{priceRange}</Badge>
        {ratings.count > 0 && (
          <span className="text-caption text-[var(--color-mute)]">
            {ratings.count} review{ratings.count !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* CTA */}
      <Link href={`/restaurants/${_id}`} className="mt-auto">
        <Button variant="primary" className="w-full">Reserve a table</Button>
      </Link>
    </Card>
  );
}
