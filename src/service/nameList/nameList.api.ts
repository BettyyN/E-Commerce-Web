import type { CatNameList, NameList } from "@/types/dto";
import { api, getErrorMessage } from "../api";
import type { BankIconList } from "@/types/bank";

const BASE = `${import.meta.env.VITE_ITEM_URL}/NameList`;

// All five list endpoints share the same shape, so one helper covers them
const fetchList = async (path: string): Promise<NameList[]> => {
  try {
    const res = await api.get(`${BASE}/${path}`);
    if (res.status === 204) return [];
    return res.data?.data ?? res.data;
  } catch (e) {
    throw new Error(getErrorMessage(e));
  }
};

const fetchBankList = async (path: string): Promise<BankIconList[]> => {
  try {
    const res = await api.get(`${BASE}/${path}`);
    if (res.status === 204) return [];
    return res.data?.data ?? res.data;
  } catch (e) {
    throw new Error(getErrorMessage(e));
  }
};

const fetchCategoryList = async (path: string): Promise<CatNameList[]> => {
  try {
    const res = await api.get(`${BASE}/${path}`);
    if (res.status === 204) return [];
    return res.data?.data ?? res.data;
  } catch (e) {
    throw new Error(getErrorMessage(e));
  }
};

export const nameListApi = {
  getCats: () => fetchList("Cat"),
  getCatFilter: () => fetchCategoryList("CatFilter"),
  getMeasTypes: () => fetchList("MeasType"),
  getPackTypes: () => fetchList("PackType"),
  getBankIcons: () => fetchBankList("BankIcon"),

  // Image bytes; needs the Bearer token, so fetch as a blob
  getIcon: async (id: string): Promise<Blob> => {
    try {
      const { data } = await api.get(`${BASE}/GetIcon/${id}`, {
        responseType: "blob",
      });
      return data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },
};
