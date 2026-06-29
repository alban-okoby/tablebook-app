export type UserRole = "user" | "restaurant_owner" | "admin";

export interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string | null;
  avatar: string | null;
  bio: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  phone?: string;
  bio?: string;
}
