import { AppUser } from "@/types/api";

const TOKEN_KEY = "expense-tracker-token";
const USER_KEY = "expense-tracker-user";
const THEME_KEY = "expense-tracker-theme";

export type StoredThemeMode = "light" | "dark";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AppUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
}

export function getStoredTheme(): StoredThemeMode | null {
  const mode = localStorage.getItem(THEME_KEY);
  return mode === "light" || mode === "dark" ? mode : null;
}

export function setStoredTheme(mode: StoredThemeMode) {
  localStorage.setItem(THEME_KEY, mode);
}
