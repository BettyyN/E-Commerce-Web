import type { OrderPayViewDto, CrdtPayListDto, CrdtPayPend } from "@/types/pay";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_ITEM_URL}/Pay`;

const getList = async <T>(path: string): Promise<T[]> => {
  try {
    const res = await api.get(`${BASE}/${path}`);
    if (res.status === 204) return [];
    return res.data?.data ?? res.data;
  } catch (e) {
    throw new Error(getErrorMessage(e));
  }
};

const getBlob = async (path: string): Promise<Blob> => {
  try {
    const { data } = await api.get(`${BASE}/${path}`, { responseType: "blob" });
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e));
  }
};

export const payApi = {
  // A credit order has no upfront payment, so the API answers 204 -> null
  getOrder: async (orderId: string): Promise<OrderPayViewDto | null> => {
    try {
      const res = await api.get(`${BASE}/Order/${orderId}`);
      if (res.status === 204) return null;
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getOrderReceipt: (id: string) => getBlob(`OrderReceipt/${id}`),

  // id = credit id: every payment made against the credit
  getCredit: (creditId: string) =>
    getList<CrdtPayListDto>(`Credit/${creditId}`),

  getCreditPending: async (
    creditId: string,
  ): Promise<CrdtPayPend | null> => {
    try {
      const res = await api.get(`${BASE}/CreditPend/${creditId}`);

      if (res.status === 204) return null;

      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },


  // id = credit payment id
  getCreditReceipt: (id: string) => getBlob(`CreditReceipt/${id}`),
};
