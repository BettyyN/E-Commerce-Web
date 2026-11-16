import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { proImageApi } from "./proImage.api";
import { proImageKeys } from "./proImage.key";
import type { ProImageListDto, ProImageAddDto } from "@/types/productImage";

export const useProImages = (productId: string | undefined) =>
  useQuery<ProImageListDto[], Error>({
    queryKey: proImageKeys.list(productId!),
    queryFn: () => proImageApi.getAll(productId!),
    enabled: !!productId,
  });

// Resolves to an object URL for <img src>
export const useProImage = (id: string | undefined) =>
  useQuery<string, Error>({
    queryKey: proImageKeys.file(id!),
    queryFn: async () => URL.createObjectURL(await proImageApi.getImage(id!)),
    enabled: !!id,
    staleTime: Infinity,
  });

  

export const useAddProImage = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, ProImageAddDto>({
    mutationFn: proImageApi.add,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: proImageKeys.lists() }),
  });
};

export const useChangeMainProImage = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, string>({
    mutationFn: proImageApi.changeMain,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: proImageKeys.lists() }),
  });
};

export const useDeleteProImage = () => {
  const queryClient = useQueryClient();
  return useMutation<string | undefined, Error, string>({
    mutationFn: proImageApi.remove,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: proImageKeys.all }),
  });
};
