import type {
  EmployeeAddDto,
  EmployeeListDto,
  EmployeeModDto,
} from "@/types/employee";
import type { StatChangeDto } from "@/types/dto";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_AUTH_URL}/Employee`;

export const employeeApi = {
  getAll: async (): Promise<EmployeeListDto[]> => {
    try {
      const { data } = await api.get(`${BASE}/All`);
      return data?.data ?? data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getById: async (id: string | number): Promise<EmployeeListDto> => {
    try {
      const { data } = await api.get(`${BASE}/Detail/${id}`);
      return data?.data ?? data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  changeStatus: async (payload: StatChangeDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/ChangeStat`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  add: async (payload: EmployeeAddDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/Add`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  update: async (
    id: string | number,
    payload: EmployeeModDto,
  ): Promise<string | undefined> => {
    try {
      const { data } = await api.put(`${BASE}/Mod/${id}`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  delete: async (id: string | number): Promise<string | undefined> => {
    try {
      const { data } = await api.delete(`${BASE}/Del/${id}`);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },
};