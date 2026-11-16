import { create } from "zustand";
import axios from "axios";
import {
  clearAuthTokens,
  getAccessToken,
  isTokenExpiredOrExpiringSoon,
  setAuthTokens,
} from "../utils/auth.utils";
import { decodeAccessToken, type AuthUser } from "../utils/jwt.utils";
import { requestTokenRefresh } from "@/service/auth/auth.refresh";
import { useCartStore } from "./cartStore";

const REFRESH_THRESHOLD_SECONDS = 60;

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    accessToken: string,
    refreshToken: string,
    expiresDate: string,
  ) => void;

  refresh: () => Promise<void>;
  logout: () => void;
}

let inflightRefresh: Promise<void> | null = null;

const authChannel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("auth_tokens")
    : null;

// Avoid stacked channels/listeners on Vite HMR reloads
if (import.meta.hot) {
  import.meta.hot.dispose(() => authChannel?.close());
}

const initialUser = decodeAccessToken(getAccessToken());

export const useAuthStore = create<AuthState>((set, get) => {
  /** Clear local state only (no broadcast). Used by logout and by other tabs. */
  const clearLocalSession = () => {
    clearAuthTokens();
    useCartStore.getState().clearCart();
    set({ user: null, isAuthenticated: false });
  };

  /** Sync store from the shared cookie (cookies are shared across tabs). */
  const syncFromCookie = () => {
    const user = decodeAccessToken(getAccessToken());
    set({ user, isAuthenticated: !!user });
  };

  const performRefresh = async () => {
    const data = await requestTokenRefresh();
    setAuthTokens(data.accessToken, data.refreshToken);
    syncFromCookie();
    authChannel?.postMessage({ type: "TOKENS_REFRESHED" });
  };

  const doRefresh = async (): Promise<void> => {
    set({ isLoading: true });

    try {
      if (typeof navigator !== "undefined" && navigator.locks) {
        // Only one tab refreshes at a time.
        await navigator.locks.request("token-refresh", async () => {
          // Another tab may have refreshed while we waited for the lock.
          if (!isTokenExpiredOrExpiringSoon(REFRESH_THRESHOLD_SECONDS)) {
            syncFromCookie();
            return;
          }
          await performRefresh();
        });
      } else {
        await performRefresh();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        // Refresh token rejected: the session is really over.
        if (status === 401 || status === 400) {
          get().logout();
        }
        // Network error / 5xx: keep the session, caller may retry.
      } else {
        // Non-HTTP failure (e.g. "Refresh token not found")
        get().logout();
      }
      throw error;
    } finally {
      set({ isLoading: false });
    }
  };

  /* Updates broadcast by other tabs */
  authChannel?.addEventListener("message", (event) => {
    switch (event.data?.type) {
      case "TOKENS_REFRESHED":
        syncFromCookie();
        break;
      case "LOGOUT":
        clearLocalSession();
        break;
    }
  });

  return {
    user: initialUser,
    isAuthenticated: !!initialUser,
    isLoading: false,

    login: (accessToken, refreshToken, expiresDate) => {
      setAuthTokens(accessToken, refreshToken, expiresDate);
      const user = decodeAccessToken(accessToken);
      set({ user, isAuthenticated: !!user });
    },

    // Single-flight: every caller shares one in-flight refresh.
    refresh: () => {
      if (inflightRefresh) return inflightRefresh;
      inflightRefresh = doRefresh().finally(() => {
        inflightRefresh = null;
      });
      return inflightRefresh;
    },

    logout: () => {
      clearLocalSession();
      authChannel?.postMessage({ type: "LOGOUT" });
    },
  };
});
