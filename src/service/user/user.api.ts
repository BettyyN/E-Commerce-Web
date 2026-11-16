import type { EmployeeListDto } from "@/types/employee";
import type { CustomerListDto } from "@/types/customer";
import type { StatChangeDto } from "@/types/dto";
import type { ChangePwdDto } from "@/types/auth/auth";
import { api, getErrorMessage } from "../api";

const BASE = `${import.meta.env.VITE_AUTH_URL}/User`;

export const userApi = {
  /* ---------- Customers ---------- */

  getAllCustomers: async (): Promise<CustomerListDto[]> => {
    try {
      const { data } = await api.get(`${BASE}/AllCust`);
      return data?.data ?? data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getCustomerById: async (id: string): Promise<CustomerListDto> => {
    try {
      const { data } = await api.get(`${BASE}/CustDetail/${id}`);
      return data?.data ?? data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  changeCustomerStat: async (payload: StatChangeDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/StatCust`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  /* ---------- Employees ---------- */

  getAllEmployees: async (): Promise<EmployeeListDto[]> => {
    try {
      const { data } = await api.get(`${BASE}/AllEmp`);
      return data?.data ?? data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  getEmployeeById: async (id: string): Promise<EmployeeListDto> => {
    try {
      const { data } = await api.get(`${BASE}/DetailEmp/${id}`);
      return data?.data ?? data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  changeEmployeeStat: async (payload: StatChangeDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/StatEmp`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  /* ---------- Shared ---------- */

  delete: async (id: string): Promise<string | undefined> => {
    try {
      const { data } = await api.delete(`${BASE}/Del/${id}`);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  changePassword: async (payload: ChangePwdDto): Promise<string | undefined> => {
    try {
      const { data } = await api.put(`${BASE}/ChangePwd`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },
};
