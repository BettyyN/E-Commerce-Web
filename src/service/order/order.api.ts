import type { OrderListDto, OrderViewDto, OrderRvwDto } from "@/types/order";
import type { StatChangeDto } from "@/types/dto";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_ITEM_URL}/Order`;

export const orderApi = {
  getAll: async (): Promise<OrderListDto[]> => {
    try {
      const res = await api.get(`${BASE}/AllList`);
      if (res.status === 204) return [];
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getPending: async (): Promise<OrderListDto[]> => {
    try {
      const res = await api.get(`${BASE}/Pend`);
      if (res.status === 204) return [];
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getById: async (id: string): Promise<OrderViewDto> => {
    try {
      const res = await api.get(`${BASE}/View/${id}`);
      if (res.status === 204) throw new Error("Order not found.");
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  // Paid orders: confirm (stat: true) or reject (stat: false) the payment
  verify: async (payload: StatChangeDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/VerifyOrder`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  // Credit orders: approve (with days to pay) or reject
  reviewCredit: async (payload: OrderRvwDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/ReviewCrdt`, payload);
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
