import type { ProViewListDto, ProViewDetailDto } from "@/types/proView";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_ITEM_URL}/ProView`;

export const proViewApi = {
  // Storefront product/variant cards
  getAll: async (): Promise<ProViewListDto[]> => {
    try {
      const res = await api.get(`${BASE}/All`);
      if (res.status === 204) return [];
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  // id = product id
  getDetail: async (id: string): Promise<ProViewDetailDto> => {
    try {
      const res = await api.get(`${BASE}/Detail/${id}`);
      if (res.status === 204) throw new Error("Product not found.");
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  // id = image id; returns the image bytes
  getImage: async (id: string): Promise<Blob> => {
    try {
      const { data } = await api.get(`${BASE}/MainImage/${id}`, {
        responseType: "blob",
      });
      return data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  // id = image id; returns the image bytes
  getImages: async (id: string): Promise<Blob> => {
    try {
      const { data } = await api.get(`${BASE}/ProImage/${id}`, {
        responseType: "blob",
      });
      return data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },
};
