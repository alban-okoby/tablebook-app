export type PriceRange = "$" | "$$" | "$$$" | "$$$$";

export type Cuisine =
  | "Italian" | "French" | "Japanese" | "Chinese" | "Indian" | "Mexican"
  | "American" | "Mediterranean" | "Thai" | "Greek" | "Spanish" | "Lebanese"
  | "Korean" | "Vietnamese" | "Turkish" | "Moroccan" | "Brazilian" | "Seafood"
  | "Vegetarian" | "Vegan" | "Steakhouse" | "Fusion" | "Other";

export interface Review {
  _id: string;
  user: { _id: string; username: string; avatar: string | null };
  rating: number;
  title?: string;
  body: string;
  likes: string[];
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  label?: string;
  capacity: number;
  count: number;
}

export interface OpeningHours {
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  open?: string;
  close?: string;
  isClosed: boolean;
}

export interface Restaurant {
  _id: string;
  name: string;
  description?: string;
  cuisine: Cuisine[];
  address: {
    street?: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  images: string[];
  coverImage: string | null;
  priceRange: PriceRange;
  tables: Table[];
  openingHours: OpeningHours[];
  ratings: { average: number; count: number };
  reviews: Review[];
  addedBy: { _id: string; username: string; avatar: string | null };
  isFeatured: boolean;
  isApproved: boolean;
  viewCount: number;
  reviewCount: number;
  totalCapacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantListResponse {
  restaurants: Restaurant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface RestaurantSearchParams {
  q?: string;
  cuisine?: string;
  city?: string;
  priceRange?: PriceRange;
  minRating?: number;
  sortBy?: "relevance" | "newest" | "rating" | "popular" | "name";
  page?: number;
  limit?: number;
}
