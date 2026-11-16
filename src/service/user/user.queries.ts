import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "./user.api";
import { userKeys } from "./user.key";
import type { EmployeeListDto } from "@/types/employee";
import type { CustomerListDto } from "@/types/customer";
import type { StatChangeDto } from "@/types/dto";
import type { ChangePwdDto } from "@/types/auth/auth";

/* =========================================
   CUSTOMERS
========================================= */

export const useCustomers = () => {
  return useQuery<CustomerListDto[], Error>({
    queryKey: userKeys.customerLists(),
    queryFn: userApi.getAllCustomers,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCustomer = (id: string | undefined) => {
  return useQuery<CustomerListDto, Error>({
    queryKey: userKeys.customerDetail(id!),
    queryFn: () => userApi.getCustomerById(id!),
    enabled: !!id,
  });
};

export const useChangeCustomerStat = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, StatChangeDto>({
    mutationFn: userApi.changeCustomerStat,

    onSuccess: () => {
      // Invalidates both the list and any cached details
      queryClient.invalidateQueries({ queryKey: userKeys.customers() });
    },
  });
};

/* =========================================
   EMPLOYEES
========================================= */

export const useEmployees = () => {
  return useQuery<EmployeeListDto[], Error>({
    queryKey: userKeys.employeeLists(),
    queryFn: userApi.getAllEmployees,
    staleTime: 5 * 60 * 1000,
  });
};

export const useEmployee = (id: string | undefined) => {
  return useQuery<EmployeeListDto, Error>({
    queryKey: userKeys.employeeDetail(id!),
    queryFn: () => userApi.getEmployeeById(id!),
    enabled: !!id,
  });
};

export const useChangeEmployeeStat = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, StatChangeDto>({
    mutationFn: userApi.changeEmployeeStat,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.employees() });
    },
  });
};

/* =========================================
   SHARED
========================================= */

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, string>({
    mutationFn: userApi.delete,

    onSuccess: () => {
      // Endpoint is shared, so refresh both customers and employees
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useChangePassword = () => {
  return useMutation<string | undefined, Error, ChangePwdDto>({
    mutationFn: userApi.changePassword,
  });
};
