import type { CreditListDto, CreditViewDto } from "@/types/credit";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_ITEM_URL}/Credit`;

export const creditApi = {
  getPaid: async (): Promise<CreditListDto[]> => {
    try {
      const res = await api.get(`${BASE}/Paid`);
      if (res.status === 204) return []; // no content = empty list
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getUnpaid: async (): Promise<CreditListDto[]> => {
    try {
      const res = await api.get(`${BASE}/Unpaid`);
      if (res.status === 204) return [];
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getByOrderId: async (orderId: string): Promise<CreditViewDto> => {
    try {
      const res = await api.get(`${BASE}/ByOrder/${orderId}`);
      if (res.status === 204) throw new Error("Credit not found.");
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getById: async (id: string): Promise<CreditViewDto> => {
    try {
      const res = await api.get(`${BASE}/View/${id}`);
      if (res.status === 204) throw new Error("Credit not found.");
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },
};
