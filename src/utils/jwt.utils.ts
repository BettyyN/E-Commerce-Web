import { jwtDecode } from "jwt-decode";

/**
 * App-facing role names. JWT claims use backend codes (admin/mngr/emp/cust);
 * decodeAccessToken normalizes them to these so route guards and UI checks
 * can compare against one vocabulary.
 */
export type AppRole = "admin" | "sales" | "storekeeper" | "customer";

const ROLE_MAP: Record<string, AppRole> = {
  admin: "admin",
  mngr: "sales",
  emp: "sales",
  cust: "customer",
  // Forward-compatible aliases in case the backend ever emits full names
  sales: "sales",
  storekeeper: "storekeeper",
  customer: "customer",
};

// Claim names match AuthCons on the backend
interface RawClaims {
  uId: string;
  un: string;
  r: string;
  stat: string;
  eId?: string;
  cId?: string;
  exp: number;
}

export interface AuthUser {
  userId: string; // uId
  profileId: string; // admin -> uId, mngr/emp -> eId, cust -> cId
  userName: string; // un
  role: AppRole; // r
  isActive: boolean; // stat
  exp: number;
}

export function decodeAccessToken(token: string | null | undefined): AuthUser | null {
  if (!token) return null;

  try {
    const c = jwtDecode<RawClaims>(token);
    const rawRole = c.r?.toLowerCase() ?? "";
    const role = ROLE_MAP[rawRole];
    if (!role) return null; // unknown role claim

    let profileId = c.uId;
    if (rawRole === "emp" || rawRole === "mngr") profileId = c.eId ?? c.uId;
    if (rawRole === "cust") profileId = c.cId ?? c.uId;

    return {
      userId: c.uId,
      profileId,
      userName: c.un,
      role,
      isActive: String(c.stat).toLowerCase() === "true",
      exp: c.exp,
    };
  } catch {
    return null; // malformed token
  }
}
