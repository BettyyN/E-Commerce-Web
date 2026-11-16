
import type { RoleDto } from "@/types/role";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_AUTH_URL}/Role`;

export const roleApi = {
  getAll: async (): Promise<RoleDto[]> => {
    try {
      const { data } = await api.get(`${BASE}/All`);
      return data?.data ?? data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getById: async (id: string): Promise<RoleDto> => {
    try {
      const { data } = await api.get(`${BASE}/Detail/${id}`);
      return data?.data ?? data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },
};
