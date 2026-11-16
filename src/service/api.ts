import axios, { isAxiosError } from "axios";
import { getAccessToken } from "../utils/auth.utils";
import { useAuthStore } from "@/store/auth.store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL,
  timeout: 10000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const multipart = { headers: { "Content-Type": "multipart/form-data" } };

/* REQUEST INTERCEPTOR: always attaches the *current* token */
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* RESPONSE INTERCEPTOR */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    const authPrefix = import.meta.env.VITE_AUTH_URL as string | undefined;
    const isAuthCall =
      !!authPrefix && !!originalRequest?.url?.includes(authPrefix);

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthCall
    ) {
      originalRequest._retry = true;

      const sentToken = String(
        originalRequest.headers?.Authorization ?? "",
      ).replace("Bearer ", "");

      if (sentToken && sentToken !== getAccessToken()) {
        return api(originalRequest);
      }

      await useAuthStore.getState().refresh();
      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);

/* ERROR MESSAGE EXTRACTOR: unchanged */
export function getErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred.",
): string {
  if (isAxiosError<any>(error)) {
    const data = error.response?.data;

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      const msg = data.errors
        .map((e: any) => e?.error ?? e)
        .filter(Boolean)
        .join(", ");
      if (msg) return msg;
    } else if (
      data?.errors &&
      typeof data.errors === "object" &&
      !Array.isArray(data.errors)
    ) {
      const msg = Object.values(data.errors).flat().filter(Boolean).join(", ");
      if (msg) return msg;
    }

    if (data?.detail) return data.detail;
    if (data?.message) return data.message;
    if (data?.title) return data.title;

    if (error.code === "ERR_NETWORK") return "Cannot reach the server";

    return error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
