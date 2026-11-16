import { useQuery } from "@tanstack/react-query";
import { creditApi } from "./credit.api";
import { creditKeys } from "./credit.key";
import type { CreditListDto, CreditViewDto } from "@/types/credit";

export const useCreditsPaid = () => {
  return useQuery<CreditListDto[], Error>({
    queryKey: creditKeys.paid(),
    queryFn: creditApi.getPaid,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreditsUnpaid = () => {
  return useQuery<CreditListDto[], Error>({
    queryKey: creditKeys.unpaid(),
    queryFn: creditApi.getUnpaid,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCredit = (id: string | undefined) => {
  return useQuery<CreditViewDto, Error>({
    queryKey: creditKeys.detail(id!),
    queryFn: () => creditApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreditByOrderId = (orderId: string | undefined) => {
  return useQuery<CreditViewDto, Error>({
    queryKey: creditKeys.byOrder(orderId!),
    queryFn: () => creditApi.getByOrderId(orderId!),
    enabled: !!orderId,
  });
};
