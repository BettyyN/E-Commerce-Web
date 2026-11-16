import type { CustReg, RegRes } from "@/types/auth/register";
import type { LoginDto, LoginResDto } from "@/types/auth/auth";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_AUTH_URL}`;

export const authApi = {
  login: async (payload: LoginDto): Promise<LoginResDto> => {
    try {
      const { data } = await api.post(`${BASE}/Login`, payload);
      return data?.data ?? data;
    } catch (error) {
       throw new Error(getErrorMessage(error));
    }
  },

  register: async (payload: CustReg): Promise<RegRes> => {
    try {
      const { data } = await api.post(`${BASE}/Register`, payload);
      return data?.data ?? data;
    } catch (error) {
       throw new Error(getErrorMessage(error));
    }
  },
};
