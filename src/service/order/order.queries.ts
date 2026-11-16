import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "./order.api";
import { orderKeys } from "./order.key";
import { creditKeys } from "../credit/credit.key"; // adjust path
import type { OrderListDto, OrderViewDto, OrderRvwDto } from "@/types/order";
import type { StatChangeDto } from "@/types/dto";
import { payKeys } from "../pay/pay.key";

export const useOrders = () =>
  useQuery<OrderListDto[], Error>({
    queryKey: orderKeys.list(),
    queryFn: orderApi.getAll,
    staleTime: 60 * 1000,
  });

export const usePendingOrders = () =>
  useQuery<OrderListDto[], Error>({
    queryKey: orderKeys.pending(),
    queryFn: orderApi.getPending,
    staleTime: 30 * 1000,
  });

export const useOrder = (id: string | undefined) =>
  useQuery<OrderViewDto, Error>({
    queryKey: orderKeys.detail(id!),
    queryFn: () => orderApi.getById(id!),
    enabled: !!id,
  });

export const useVerifyOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, StatChangeDto>({
    mutationFn: orderApi.verify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: payKeys.all });
    },
  });
};

export const useReviewCreditOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, OrderRvwDto>({
    mutationFn: orderApi.reviewCredit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: creditKeys.all }); 
      queryClient.invalidateQueries({ queryKey: payKeys.all });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, string>({
    mutationFn: orderApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
      queryClient.invalidateQueries({ queryKey: payKeys.all });
    },
  });
};
