import { useQuery } from "@tanstack/react-query";
import { myDataApi } from "./myData.api";
import { myDataKeys } from "./myData.key";
import type { MyOrdListDto, MyOrdViewDto } from "@/types/myOrder";
import type { MyCrdtListDto, MyCrdtViewDto } from "@/types/myCredit";

export const useMyOrders = () => {
  return useQuery<MyOrdListDto[], Error>({
    queryKey: myDataKeys.orderList(),
    queryFn: myDataApi.getOrderAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMyOrder = (id: string | undefined) => {
  return useQuery<MyOrdViewDto, Error>({
    queryKey: myDataKeys.orderDetail(id!),
    queryFn: () => myDataApi.getOrderById(id!),
    enabled: !!id,
  });
};

export const useMyCredits = () => {
  return useQuery<MyCrdtListDto[], Error>({
    queryKey: myDataKeys.creditList(),
    queryFn: myDataApi.getCreditAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMyCredit = (id: string | undefined) => {
  return useQuery<MyCrdtViewDto, Error>({
    queryKey: myDataKeys.creditDetail(id!),
    queryFn: () => myDataApi.getCreditById(id!),
    enabled: !!id,
  });
};