import { apiRequest } from "@/lib/apiClient";
import { AppUser, AuthResponse } from "@/types/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  displayName: string;
}

export function login(payload: LoginPayload) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterPayload) {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser(token: string) {
  return apiRequest<AppUser>("/api/users/me", {
    token,
  });
}
