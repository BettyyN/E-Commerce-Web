import axios from "axios";
import { getRefreshToken } from "@/utils/auth.utils";
import type { TokenDto } from "@/types/auth/auth";

// Plain instance — intentionally has no request/response interceptors.
const authAxios = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export async function requestTokenRefresh(): Promise<TokenDto> {
  const token = getRefreshToken();
  if (!token) throw new Error("Refresh token not found");

  const { data } = await authAxios.post(
    `${import.meta.env.VITE_AUTH_URL}/RefreshToken`,
    { token },
    { headers: { Authorization: undefined } },
  );

  return data?.data ?? data;
}
