import type { CrdtPayAddDto } from "@/types/creditPay";
import type { StatChangeDto } from "@/types/dto";
import { api, getErrorMessage, multipart } from "../api";

const BASE = `${import.meta.env.VITE_ITEM_URL}/CrdtPay`;

const buildAddForm = (payload: CrdtPayAddDto) => {
  const form = new FormData();
  form.append("payMethod", payload.payMethod);
  form.append("amount", String(payload.amount));
  form.append("creditId", payload.creditId);
  form.append("bankId", payload.bankId);
  form.append("receipt", payload.receipt);
  return form;
};

export const crdtPayApi = {
  // stat: true = approve, false = reject
  review: async (payload: StatChangeDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/Review`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  add: async (payload: CrdtPayAddDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(
        `${BASE}/Add`,
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
