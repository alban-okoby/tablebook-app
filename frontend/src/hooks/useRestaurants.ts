"use client";

import { useState, useEffect } from "react";
import { restaurants as api } from "@/lib/api";
import type { Restaurant, RestaurantSearchParams } from "@/types/restaurant";

export function useRestaurants(params: RestaurantSearchParams = {}) {
  const [data, setData] = useState<Restaurant[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const key = JSON.stringify(params);

  useEffect(() => {
    setLoading(true);
    setError("");
    api.list(params)
      .then(({ restaurants, pagination }) => {
        setData(restaurants);
        setTotal(pagination.total);
        setPages(pagination.pages);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { restaurants: data, total, pages, loading, error };
}

export function useRestaurant(id: string) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(id)
      .then(({ restaurant }) => setRestaurant(restaurant))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function patchReviews(
    reviews: Restaurant["reviews"],
    ratings: Restaurant["ratings"]
  ) {
    setRestaurant((prev) => prev ? { ...prev, reviews, ratings } : prev);
  }

  return { restaurant, loading, error, patchReviews };
}
