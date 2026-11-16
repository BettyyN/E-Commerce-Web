import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { proVarApi } from "./proVar.api";
import { proVarKeys } from "./proVar.key";
import { proDiscntKeys } from "../proDiscnt/proDiscnt.key";
import type {
  ProVarListDto,
  ProVarDetailDto,
  ProVarAddDto,
  ProVarModDto,
  ProVarPriceDto,
  ProVarQtyDto,
} from "@/types/productVariant";
import type { StatChangeDto } from "@/types/dto";

export const useProVariants = (productId: string | undefined) =>
  useQuery<ProVarListDto[], Error>({
    queryKey: proVarKeys.list(productId!),
    queryFn: () => proVarApi.getAll(productId!),
    enabled: !!productId,
  });

export const useProVariant = (id: string | undefined) =>
  useQuery<ProVarDetailDto, Error>({
    queryKey: proVarKeys.detail(id!),
    queryFn: () => proVarApi.getById(id!),
    enabled: !!id,
  });

export const useAddProVariant = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, ProVarAddDto>({
    mutationFn: proVarApi.add,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: proVarKeys.all }),
  });
};

export const useUpdateProVariant = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, ProVarModDto>({
    mutationFn: proVarApi.modify,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: proVarKeys.all }),
  });
};

export const useUpdateProVariantPrice = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, ProVarPriceDto>({
    mutationFn: proVarApi.updatePrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proVarKeys.all });
      queryClient.invalidateQueries({ queryKey: proDiscntKeys.all }); // old / new prices shown there
    },
  });
};

export const useUpdateProVariantQty = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, ProVarQtyDto>({
    mutationFn: proVarApi.updateQuantity,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: proVarKeys.all }),
  });
};

export const useChangeProVariantDefault = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, string>({
    mutationFn: proVarApi.changeDefault,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: proVarKeys.all }),
  });
};

export const useChangeProVariantStat = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, StatChangeDto>({
    mutationFn: proVarApi.changeStat,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: proVarKeys.all }),
  });
};

export const useDeleteProVariant = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, string>({
    mutationFn: proVarApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proVarKeys.all });
      queryClient.invalidateQueries({ queryKey: proDiscntKeys.all });
    },
  });
};
