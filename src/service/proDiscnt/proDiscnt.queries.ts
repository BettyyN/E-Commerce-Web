import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { proDiscntApi } from "./proDiscnt.api";
import { proDiscntKeys } from "./proDiscnt.key";
import type {
  ProDiscntListDto,
  VarDiscntListDto,
  ProDiscntAddDto,
  ProDiscntModDto,
} from "@/types/productDiscount";
import type { StatChangeDto } from "@/types/dto";

export const useProDiscounts = () =>
  useQuery<ProDiscntListDto[], Error>({
    queryKey: proDiscntKeys.list(),
    queryFn: proDiscntApi.getAll,
    staleTime: 2 * 60 * 1000,
  });

export const useVariantDiscounts = (variantId: string | undefined) =>
  useQuery<VarDiscntListDto[], Error>({
    queryKey: proDiscntKeys.variant(variantId!),
    queryFn: () => proDiscntApi.getByVariant(variantId!),
    enabled: !!variantId,
  });

export const useAddProDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, ProDiscntAddDto>({
    mutationFn: proDiscntApi.add,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: proDiscntKeys.all }),
  });
};

export const useUpdateProDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, ProDiscntModDto>({
    mutationFn: proDiscntApi.modify,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: proDiscntKeys.all }),
  });
};

export const useChangeProDiscountStat = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, StatChangeDto>({
    mutationFn: proDiscntApi.changeStat,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: proDiscntKeys.all }),
  });
};

export const useDeleteProDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, string>({
    mutationFn: proDiscntApi.remove,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: proDiscntKeys.all }),
  });
};
