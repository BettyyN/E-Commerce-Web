import type { ProImageListDto, ProImageAddDto } from "@/types/productImage";
import { api, getErrorMessage, multipart } from "../api";

const BASE = `${import.meta.env.VITE_ITEM_URL}/ProImage`;

const buildAddForm = (payload: ProImageAddDto) => {
  const form = new FormData();
  form.append("productId", payload.productId);
  form.append("isMain", String(payload.isMain));
  form.append("image", payload.image);
  return form;
};

export const proImageApi = {
  // id = product id
  getAll: async (productId: string): Promise<ProImageListDto[]> => {
    try {
      const res = await api.get(`${BASE}/AllList/${productId}`);
      if (res.status === 204) return [];
      return res.data?.data ?? res.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  // id = image id; needs the Bearer token, so it is fetched as a blob
  getImage: async (id: string): Promise<Blob> => {
    try {
      const { data } = await api.get(`${BASE}/GetImage/${id}`, {
        responseType: "blob",
      });
      return data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  changeMain: async (id: string): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/ChangeMain/${id}`);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  add: async (payload: ProImageAddDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(
        `${BASE}/Add/${payload.productId}`,
        buildAddForm(payload),
        multipart,
      );
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
