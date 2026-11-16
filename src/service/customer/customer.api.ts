import type {
  CustomerAddDto,
  CustomerListDto,
  CustomerModDto,
} from "@/types/customer";
import type { StatChangeDto } from "@/types/dto";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_AUTH_URL}/Customer`;

export const customerApi = {
  getAll: async (): Promise<CustomerListDto[]> => {
    try {
      const { data } = await api.get(`${BASE}/All`);
      return data?.data ?? data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getDetail: async (id: string): Promise<CustomerListDto> => {
    try {
      const { data } = await api.get(`${BASE}/Detail/${id}`);
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

  add: async (payload: CustomerAddDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/Add`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  modify: async (id: string, payload: CustomerModDto): Promise<string | undefined> => {
    try {
      const { data } = await api.put(`${BASE}/Mod/${id}`, payload);
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
