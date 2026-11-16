import { useQuery } from "@tanstack/react-query";
import { payApi } from "./pay.api";
import { payKeys } from "./pay.key";
import type { OrderPayViewDto, CrdtPayListDto, CrdtPayPend } from "@/types/pay";

export const useOrderPayment = (orderId: string | undefined) =>
  useQuery<OrderPayViewDto | null, Error>({
    queryKey: payKeys.order(orderId!),
    queryFn: () => payApi.getOrder(orderId!),
    enabled: !!orderId,
  });

// Resolves to an object URL (image or PDF) for <img>, <iframe> or a link
export const useOrderReceipt = (id: string | undefined) =>
  useQuery<string, Error>({
    queryKey: payKeys.orderReceipt(id!),
    queryFn: async () => URL.createObjectURL(await payApi.getOrderReceipt(id!)),
    enabled: !!id,
    staleTime: Infinity,
  });

export const useCreditPayments = (creditId: string | undefined) =>
  useQuery<CrdtPayListDto[], Error>({
    queryKey: payKeys.credit(creditId!),
    queryFn: () => payApi.getCredit(creditId!),
    enabled: !!creditId,
  });

export const useCreditPendingPayments = (creditId: string | undefined) =>
  useQuery<CrdtPayPend | null, Error>({
    queryKey: payKeys.creditPending(creditId!),
    queryFn: () => payApi.getCreditPending(creditId!),
    enabled: !!creditId,
  });

export const useCreditReceipt = (id: string | undefined) =>
  useQuery<string, Error>({
    queryKey: payKeys.creditReceipt(id!),
    queryFn: async () =>
      URL.createObjectURL(await payApi.getCreditReceipt(id!)),
    enabled: !!id,
    staleTime: Infinity,
  });
