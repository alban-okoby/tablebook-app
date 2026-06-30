"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Input, Button } from "@/components/ui";
import { CuisinePill } from "./CuisinePill";
import type { Cuisine } from "@/types/restaurant";

const CUISINES: Cuisine[] = [
  "Italian", "French", "Japanese", "Chinese", "Indian", "Mexican",
  "American", "Mediterranean", "Thai", "Steakhouse", "Seafood", "Vegan",
];

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [city, setCity] = useState(params.get("city") ?? "");
  const [cuisine, setCuisine] = useState(params.get("cuisine") ?? "");

  const toggleCuisine = (c: Cuisine) => {
    setCuisine((prev) => (prev === c ? "" : c));
  };

  const handleSearch = () => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (city) sp.set("city", city);
    if (cuisine) sp.set("cuisine", cuisine);
    router.push(`/restaurants?${sp.toString()}`);
  };

  return (
    <div
      className="rounded-[var(--radius-xl)] p-[var(--spacing-xl)] border border-[var(--color-ink)]"
      style={{ backgroundColor: "var(--color-canvas)" }}
    >
      {/* Search inputs row */}
      <div className="flex flex-col sm:flex-row gap-[var(--spacing-md)] mb-[var(--spacing-xl)]">
        <Input
          placeholder="Search restaurants…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
          leftIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
        />
        <Input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="sm:w-44"
          leftIcon={<FontAwesomeIcon icon={faLocationDot} />}
        />
        <Button variant="primary" onClick={handleSearch} className="sm:shrink-0">
          Search
        </Button>
      </div>

      {/* Cuisine pills */}
      <div className="flex flex-wrap gap-[var(--spacing-sm)]">
        {CUISINES.map((c) => (
          <CuisinePill
            key={c}
            label={c}
            active={cuisine === c}
            onClick={() => toggleCuisine(c)}
          />
        ))}
      </div>
    </div>
  );
}
