import type { Restaurant } from "./restaurant";
import type { User } from "./user";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "no-show";

export interface Booking {
  _id: string;
  restaurant: Pick<Restaurant, "_id" | "name" | "address" | "cuisine" | "coverImage" | "phone" | "email">;
  user: Pick<User, "_id" | "username" | "email" | "avatar">;
  date: string;
  time: string;
  partySize: number;
  tableLabel?: string;
  status: BookingStatus;
  specialRequests?: string;
  confirmationCode: string;
  cancelledAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  restaurant: string;
  date: string;
  time: string;
  partySize: number;
  specialRequests?: string;
  tableLabel?: string;
}

export interface BookingListResponse {
  bookings: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
