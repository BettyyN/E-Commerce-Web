import type {
  ProVarListDto,
  ProVarDetailDto,
  ProVarAddDto,
  ProVarModDto,
  ProVarPriceDto,
  ProVarQtyDto,
} from "@/types/productVariant";
import type { StatChangeDto } from "@/types/dto";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_ITEM_URL}/ProVar`;

export const proVarApi = {
  // id = product id
  getAll: async (productId: string): Promise<ProVarListDto[]> => {
    try {
      const res = await api.get(`${BASE}/AllList/${productId}`);
      if (res.status === 204) return [];
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  // id = variant id
  getById: async (id: string): Promise<ProVarDetailDto> => {
    try {
      const res = await api.get(`${BASE}/Detail/${id}`);
      if (res.status === 204) throw new Error("Variant not found.");
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  updatePrice: async (payload: ProVarPriceDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/UpdatePrc`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  updateQuantity: async (payload: ProVarQtyDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/UpdateQty`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  // The API uses DELETE for this call: it makes the variant the product's default
  changeDefault: async (id: string): Promise<string | undefined> => {
    try {
      const { data } = await api.delete(`${BASE}/ChangeDef/${id}`);
      return data?.message;
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

  add: async (payload: ProVarAddDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/Add`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  modify: async (payload: ProVarModDto): Promise<string | undefined> => {
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
