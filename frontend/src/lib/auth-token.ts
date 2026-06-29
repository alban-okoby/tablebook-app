// Mirrors the JWT into a cookie alongside localStorage so middleware.ts
// (which runs on the edge, with no access to localStorage) can gate /bookings.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, matches JWT_EXPIRE

export function setToken(token: string) {
  localStorage.setItem("token", token);
  document.cookie = `token=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearToken() {
  localStorage.removeItem("token");
  document.cookie = "token=; path=/; max-age=0";
}
