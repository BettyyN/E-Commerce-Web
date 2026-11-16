import type {
  BankListDto,
  BankDetailDto,
  BankAddDto,
  BankModDto,
} from "@/types/bank";
import type { StatChangeDto } from "@/types/dto";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_ITEM_URL}/Bank`;

const buildAddForm = (payload: BankAddDto) => {
  const form = new FormData();
  form.append("name", payload.name);
  form.append("acctNum", payload.acctNum);
  form.append("acctHolder", payload.acctHolder);
  form.append("icon", payload.icon, payload.icon.name);
  return form;
};

const buildModForm = (payload: BankModDto) => {
  const form = new FormData();
  form.append("id", payload.id);
  form.append("name", payload.name);
  form.append("acctNum", payload.acctNum);
  form.append("acctHolder", payload.acctHolder);
  if (payload.icon) form.append("icon", payload.icon, payload.icon.name);
  return form;
};

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

export const bankApi = {
  getAll: async (): Promise<BankListDto[]> => {
    try {
      const { data } = await api.get(`${BASE}/AllList`);
      return data?.data ?? data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getById: async (id: string): Promise<BankDetailDto> => {
    try {
      const { data } = await api.get(`${BASE}/Detail/${id}`);
      return data?.data ?? data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getIcon: async (id: string): Promise<Blob> => {
    try {
      const { data } = await api.get(`${BASE}/Icon/${id}`, {
        responseType: "blob",
      });
      return data;
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

  add: async (payload: BankAddDto): Promise<string | undefined> => {
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

  modify: async (payload: BankModDto): Promise<string | undefined> => {
    try {
      const { data } = await api.put(
        `${BASE}/Mod/${payload.id}`,
        buildModForm(payload),
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
