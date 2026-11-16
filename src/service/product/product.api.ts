import type {
  ProListDto,
  ProDashBoard,
  ProAddDto,
  ProModDto,
} from "@/types/product";
import type { StatChangeDto } from "@/types/dto";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_ITEM_URL}/Pro`;

export const proApi = {
  getAll: async (): Promise<ProListDto[]> => {
    try {
      const res = await api.get(`${BASE}/AllList`);
      if (res.status === 204) return [];
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getDashboard: async (id: string): Promise<ProDashBoard> => {
    try {
      const res = await api.get(`${BASE}/DashBrd/${id}`);
      if (res.status === 204) throw new Error("Product not found.");
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

  add: async (payload: ProAddDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/Add`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  modify: async (payload: ProModDto): Promise<string | undefined> => {
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
