import type {
  MeasTypeListDto,
  MeasTypeAddDto,
  MeasTypeModDto,
} from "@/types/measType";
import type { StatChangeDto } from "@/types/dto";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_ITEM_URL}/MeasType`;

export const measTypeApi = {
  getAll: async (): Promise<MeasTypeListDto[]> => {
    try {
      const { data } = await api.get(`${BASE}/AllList`);
      return data?.data ?? data;
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

  add: async (payload: MeasTypeAddDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/Add`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  modify: async (payload: MeasTypeModDto): Promise<string | undefined> => {
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
