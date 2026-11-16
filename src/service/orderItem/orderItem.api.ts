import type { OrderItemListDto, OrderItemDetailDto } from "@/types/orderItem";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_ITEM_URL}/OrderItem`;

export const orderItemApi = {
  // id = the order's id
  getAll: async (orderId: string): Promise<OrderItemListDto[]> => {
    try {
      const res = await api.get(`${BASE}/AllList/${orderId}`);
      if (res.status === 204) return [];
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  // id = the order item's id
  getById: async (id: string): Promise<OrderItemDetailDto> => {
    try {
      const res = await api.get(`${BASE}/Detail/${id}`);
      if (res.status === 204) throw new Error("Order item not found.");
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },
};
