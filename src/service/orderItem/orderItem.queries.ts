import { useQuery } from "@tanstack/react-query";
import { orderItemApi } from "./orderItem.api";
import { orderItemKeys } from "./orderItem.key";
import type { OrderItemListDto, OrderItemDetailDto } from "@/types/orderItem";

export const useOrderItems = (orderId: string | undefined) =>
  useQuery<OrderItemListDto[], Error>({
    queryKey: orderItemKeys.list(orderId!),
    queryFn: () => orderItemApi.getAll(orderId!),
    enabled: !!orderId,
  });

export const useOrderItem = (id: string | undefined) =>
  useQuery<OrderItemDetailDto, Error>({
    queryKey: orderItemKeys.detail(id!),
    queryFn: () => orderItemApi.getById(id!),
    enabled: !!id,
  });
