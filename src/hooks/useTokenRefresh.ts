import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

const THRESHOLD_SECONDS = 60; 
const MIN_DELAY_MS = 5_000; 
const RETRY_DELAY_MS = 10_000; 

export function useTokenRefresh() {
  const exp = useAuthStore((s) => s.user?.exp);
  const refresh = useAuthStore((s) => s.refresh);

  useEffect(() => {
    if (!exp) return;

    let timerId: number;
    let cancelled = false;

    const schedule = (ms: number) => {
      timerId = window.setTimeout(async () => {
        try {
          await refresh();
        } catch {
       
          if (!cancelled && useAuthStore.getState().isAuthenticated) {
            schedule(RETRY_DELAY_MS);
          }
        }
      }, ms);
    };

    const nowSec = Math.floor(Date.now() / 1000);
    schedule(Math.max(MIN_DELAY_MS, (exp - nowSec - THRESHOLD_SECONDS) * 1000));

    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [exp, refresh]);
}
