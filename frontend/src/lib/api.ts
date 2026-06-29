import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/user";
import type { Restaurant, RestaurantListResponse, RestaurantSearchParams } from "@/types/restaurant";
import type { Booking, BookingListResponse, CreateBookingPayload } from "@/types/booking";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const auth = {
  login: (payload: LoginPayload) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),

  register: (payload: RegisterPayload) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(payload) }),

  me: () => request<{ user: User }>("/auth/me"),

  updateMe: (payload: Partial<Pick<User, "username" | "bio" | "phone" | "avatar">>) =>
    request<{ user: User }>("/auth/me", { method: "PATCH", body: JSON.stringify(payload) }),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    request<{ token: string; user: User }>("/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteMe: () => request<{ message: string }>("/auth/me", { method: "DELETE" }),
};

// ── Restaurants ───────────────────────────────────────────────────────────────

export const restaurants = {
  list: (params: RestaurantSearchParams = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return request<RestaurantListResponse>(`/restaurants${qs ? `?${qs}` : ""}`);
  },

  featured: () => request<{ restaurants: Restaurant[] }>("/restaurants/featured"),

  get: (id: string) => request<{ restaurant: Restaurant }>(`/restaurants/${id}`),

  create: (data: Partial<Restaurant>) =>
    request<{ restaurant: Restaurant }>("/restaurants", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Restaurant>) =>
    request<{ restaurant: Restaurant }>(`/restaurants/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/restaurants/${id}`, { method: "DELETE" }),

  addReview: (id: string, review: { rating: number; body: string; title?: string }) =>
    request<{ reviews: Restaurant["reviews"]; ratings: Restaurant["ratings"] }>(
      `/restaurants/${id}/reviews`,
      { method: "POST", body: JSON.stringify(review) }
    ),

  deleteReview: (restaurantId: string, reviewId: string) =>
    request<{ message: string }>(`/restaurants/${restaurantId}/reviews/${reviewId}`, {
      method: "DELETE",
    }),
};

// ── Bookings ──────────────────────────────────────────────────────────────────

export const bookings = {
  list: (params: { status?: string; page?: number; limit?: number } = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return request<BookingListResponse>(`/bookings${qs ? `?${qs}` : ""}`);
  },

  create: (payload: CreateBookingPayload) =>
    request<{ booking: Booking }>("/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  get: (id: string) => request<{ booking: Booking }>(`/bookings/${id}`),

  cancel: (id: string, reason?: string) =>
    request<{ booking: Booking }>(`/bookings/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),

  confirm: (id: string) =>
    request<{ booking: Booking }>(`/bookings/${id}/confirm`, { method: "PATCH" }),

  complete: (id: string) =>
    request<{ booking: Booking }>(`/bookings/${id}/complete`, { method: "PATCH" }),

  forRestaurant: (restaurantId: string, params: { date?: string; status?: string } = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return request<BookingListResponse>(
      `/bookings/restaurant/${restaurantId}${qs ? `?${qs}` : ""}`
    );
  },
};
