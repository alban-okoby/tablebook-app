import { RestaurantCard } from "./RestaurantCard";
import type { Restaurant } from "@/types/restaurant";

interface RestaurantGridProps {
  restaurants: Restaurant[];
  emptyMessage?: string;
}

export function RestaurantGrid({
  restaurants,
  emptyMessage = "No restaurants found.",
}: RestaurantGridProps) {
  if (restaurants.length === 0) {
    return (
      <div
        className="rounded-[var(--radius-xl)] p-[var(--spacing-3xl)] text-center"
        style={{ backgroundColor: "var(--color-canvas-soft)" }}
      >
        <p className="text-display-xs text-[var(--color-mute)] mb-[var(--spacing-sm)]">🍽</p>
        <p className="text-body-md text-[var(--color-mute)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-xl)]">
      {restaurants.map((r) => (
        <RestaurantCard key={r._id} restaurant={r} />
      ))}
    </div>
  );
}
