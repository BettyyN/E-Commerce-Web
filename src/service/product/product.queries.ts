import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { proApi } from "./product.api";
import { proKeys } from "./product.key";
import type {
  ProListDto,
  ProDashBoard,
  ProAddDto,
  ProModDto,
} from "@/types/product";
import type { StatChangeDto } from "@/types/dto";
import { proVarKeys } from "../proVar/proVar.key";
import { proDiscntKeys } from "../proDiscnt/proDiscnt.key";
import { proImageKeys } from "../proImage/proImage.key";

export const useProducts = () =>
  useQuery<ProListDto[], Error>({
    queryKey: proKeys.lists(),
    queryFn: proApi.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useProductDashboard = (id: string | undefined) =>
  useQuery<ProDashBoard, Error>({
    queryKey: proKeys.detail(id!),
    queryFn: () => proApi.getDashboard(id!),
    enabled: !!id,
  });

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, ProAddDto>({
    mutationFn: proApi.add,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: proKeys.lists() }),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, ProModDto>({
    mutationFn: proApi.modify,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: proKeys.all }),
  });
};

export const useChangeProductStat = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, StatChangeDto>({
    mutationFn: proApi.changeStat,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: proKeys.all }),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, string>({
    mutationFn: proApi.remove,
    onSuccess: () => {
      // a product owns its variants, discounts and images
      queryClient.invalidateQueries({ queryKey: proKeys.all });
      queryClient.invalidateQueries({ queryKey: proVarKeys.all });
      queryClient.invalidateQueries({ queryKey: proDiscntKeys.all });
      queryClient.invalidateQueries({ queryKey: proImageKeys.all });
    },
  });
};
