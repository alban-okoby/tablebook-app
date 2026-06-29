"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { auth as authApi } from "@/lib/api";
import { clearToken } from "@/lib/auth-token";
import type { User } from "@/types/user";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    authApi.me()
      .then(({ user }) => setUser(user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isOwner = user?.role === "restaurant_owner" || isAdmin;

  return { user, loading, isAuthenticated, isAdmin, isOwner, logout };
}
