import Cookies from "js-cookie";
import { decodeAccessToken } from "./jwt.utils";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const EXPIRES_DATE_KEY = "expiresDate";


const SECURE_OPTS: Cookies.CookieAttributes = {
  secure: import.meta.env.PROD, // HTTPS only in production; allow HTTP in dev
  sameSite: "strict",
};

export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const setAuthTokens = (
  accessToken: string,
  refreshToken: string,
  expiresDate?: string,
) => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, SECURE_OPTS);
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, SECURE_OPTS);

  if (expiresDate) {
    Cookies.set(EXPIRES_DATE_KEY, expiresDate, SECURE_OPTS);
  }
};

export const clearAuthTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(EXPIRES_DATE_KEY);
};


export const isTokenExpiredOrExpiringSoon = (
  thresholdSeconds = 60,
): boolean => {
  const token = getAccessToken();
  if (!token) return true;

  const user = decodeAccessToken(token);
  if (!user) return true;

  const nowSec = Math.floor(Date.now() / 1000);
  return user.exp - nowSec <= thresholdSeconds;
};
