import type { MyOrdListDto, MyOrdViewDto } from "@/types/myOrder";
import type { MyCrdtListDto, MyCrdtViewDto } from "@/types/myCredit";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_ITEM_URL}/MyData`;

export const myDataApi = {
  getOrderAll: async (): Promise<MyOrdListDto[]> => {
    try {
      const res = await api.get(`${BASE}/OrderAll`);
      if (res.status === 204) return [];
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getOrderById: async (id: string): Promise<MyOrdViewDto> => {
    try {
      const res = await api.get(`${BASE}/OrderView/${id}`);
      if (res.status === 204) throw new Error("Order not found.");
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getCreditAll: async (): Promise<MyCrdtListDto[]> => {
    try {
      const res = await api.get(`${BASE}/CreditAll`);
      if (res.status === 204) return [];
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getCreditById: async (id: string): Promise<MyCrdtViewDto> => {
    try {
      const res = await api.get(`${BASE}/CreditView/${id}`);
      if (res.status === 204) throw new Error("Credit not found.");
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },
};