import type {
  ProDiscntListDto,
  VarDiscntListDto,
  ProDiscntAddDto,
  ProDiscntModDto,
} from "@/types/productDiscount";
import type { StatChangeDto } from "@/types/dto";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_ITEM_URL}/ProDiscnt`;

export const proDiscntApi = {
  getAll: async (): Promise<ProDiscntListDto[]> => {
    try {
      const res = await api.get(`${BASE}/AllList`);
      if (res.status === 204) return [];
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  // id = variant id
  getByVariant: async (variantId: string): Promise<VarDiscntListDto[]> => {
    try {
      const res = await api.get(`${BASE}/VarList/${variantId}`);
      if (res.status === 204) return [];
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  changeStat: async (payload: StatChangeDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/ChangeStat`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  add: async (payload: ProDiscntAddDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/Add`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  modify: async (payload: ProDiscntModDto): Promise<string | undefined> => {
    try {
      const { data } = await api.put(`${BASE}/Mod/${payload.id}`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  remove: async (id: string): Promise<string | undefined> => {
    try {
      const { data } = await api.delete(`${BASE}/Del/${id}`);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },
};
