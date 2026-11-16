import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { customerApi } from "./customer.api";
import { customerKeys } from "./customer.keys";

import type {
  CustomerAddDto,
  CustomerModDto,
} from "@/types/customer";
import type { StatChangeDto } from "@/types/dto";

/* =========================================
   GET ALL CUSTOMERS
========================================= */

export const useCustomers = () => {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: customerApi.getAll,
  });
};

/* =========================================
   GET CUSTOMER DETAIL
========================================= */

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerApi.getDetail(id),
    enabled: !!id,
  });
};

/* =========================================
   ADD CUSTOMER
========================================= */

export const useAddCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CustomerAddDto) => customerApi.add(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });
    },
  });
};

/* =========================================
   CHANGE CUSTOMER STATUS
========================================= */

export const useChangeCustomerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StatChangeDto) => customerApi.changeStat(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.id.toString()),
      });
    },
  });
};

/* =========================================
   MODIFY CUSTOMER
========================================= */

export const useModifyCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CustomerModDto }) =>
      customerApi.modify(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.id),
      });
    },
  });
};

/* =========================================
   DELETE CUSTOMER
========================================= */

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerApi.remove(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: customerKeys.detail(id),
      });
    },
  });
};
