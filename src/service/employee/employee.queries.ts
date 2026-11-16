import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { employeeApi } from "./employee.api";
import { employeeKeys } from "./employee.keys";
import type { EmployeeModDto } from "@/types/employee";

export const useEmployees = () => {
  return useQuery({
    queryKey: employeeKeys.lists(),
    queryFn: employeeApi.getAll,
  });
};

export const useEmployee = (id: string | number, enabled = true) => {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeeApi.getById(id),
    enabled: enabled && !!id,
  });
};

export const useAddEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeApi.add,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.lists(),
      });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number;
      payload: EmployeeModDto;
    }) => employeeApi.update(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: employeeKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeApi.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.lists(),
      });
    },
  });
};

export const useChangeEmployeeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeApi.changeStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.lists(),
      });
    },
  });
};
