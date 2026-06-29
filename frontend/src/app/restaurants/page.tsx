"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/layout";
import { SearchBar } from "@/components/restaurant/SearchBar";
import { RestaurantGrid } from "@/components/restaurant/RestaurantGrid";
import { Button } from "@/components/ui";
import { useRestaurants } from "@/hooks/useRestaurants";
import type { RestaurantSearchParams } from "@/types/restaurant";

function RestaurantResults() {
  const sp = useSearchParams();

  const params: RestaurantSearchParams = {
    q:          sp.get("q")          ?? undefined,
    city:       sp.get("city")       ?? undefined,
    cuisine:    sp.get("cuisine")    ?? undefined,
    priceRange: (sp.get("priceRange") ?? undefined) as RestaurantSearchParams["priceRange"],
    minRating:  sp.get("minRating")  ? Number(sp.get("minRating"))  : undefined,
    sortBy:     (sp.get("sortBy")    ?? "newest") as RestaurantSearchParams["sortBy"],
    page:       sp.get("page")       ? Number(sp.get("page"))       : 1,
    limit:      12,
  };

  const { restaurants, total, pages, loading, error } = useRestaurants(params);
  const currentPage = params.page ?? 1;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-xl)]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-80 rounded-[var(--radius-xl)] animate-pulse"
            style={{ backgroundColor: "var(--color-canvas-soft)" }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-[var(--radius-xl)] p-[var(--spacing-3xl)] text-center"
        style={{ backgroundColor: "var(--color-canvas-soft)" }}
      >
        <p className="text-body-md text-[var(--color-negative)]">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-3xl)]">
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-[var(--color-mute)]">
          {total} restaurant{total !== 1 ? "s" : ""} found
        </p>
        <select
          defaultValue={params.sortBy}
          onChange={(e) => {
            const url = new URL(window.location.href);
            url.searchParams.set("sortBy", e.target.value);
            window.history.pushState({}, "", url.toString());
          }}
          className="text-body-sm border border-[var(--color-ink)] rounded-[var(--radius-md)] px-[var(--spacing-md)] py-[var(--spacing-xs)] bg-[var(--color-canvas)]"
        >
          <option value="newest">Newest</option>
          <option value="rating">Top rated</option>
          <option value="popular">Most popular</option>
          <option value="name">A–Z</option>
        </select>
      </div>

      <RestaurantGrid
        restaurants={restaurants}
        emptyMessage="No restaurants match your search. Try adjusting the filters."
      />

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-[var(--spacing-md)]">
          {currentPage > 1 && (
            <a href={`?${new URLSearchParams({ ...Object.fromEntries(sp), page: String(currentPage - 1) })}`}>
              <Button variant="secondary">← Previous</Button>
            </a>
          )}
          <span className="text-body-sm text-[var(--color-mute)] self-center">
            Page {currentPage} of {pages}
          </span>
          {currentPage < pages && (
            <a href={`?${new URLSearchParams({ ...Object.fromEntries(sp), page: String(currentPage + 1) })}`}>
              <Button variant="secondary">Next →</Button>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <div className="py-[var(--spacing-3xl)]" style={{ backgroundColor: "var(--color-canvas)" }}>
      <Container>
        <div className="flex flex-col gap-[var(--spacing-3xl)]">
          <div>
            <h1 className="text-display-md text-[var(--color-ink)] mb-[var(--spacing-md)]">
              Find a restaurant
            </h1>
            <p className="text-body-lg text-[var(--color-body)]">
              Browse and filter from our curated collection.
            </p>
          </div>

          <SearchBar />

          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-xl)]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 rounded-[var(--radius-xl)] animate-pulse bg-[var(--color-canvas-soft)]" />
              ))}
            </div>
          }>
            <RestaurantResults />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
