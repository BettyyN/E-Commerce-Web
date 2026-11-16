import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { catApi } from "./cat.api";
import { catKeys } from "./cat.key";
import type { CatListDto, CatAddDto, CatModDto } from "@/types/category";
import type { StatChangeDto } from "@/types/dto";
import { nameListKeys } from "../nameList/nameList.key";

export const useCategories = () => {
  return useQuery<CatListDto[], Error>({
    queryKey: catKeys.lists(),
    queryFn: catApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, CatAddDto>({
    mutationFn: catApi.add,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catKeys.lists() });
       queryClient.invalidateQueries({ queryKey: nameListKeys.all });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, CatModDto>({
    mutationFn: catApi.modify,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catKeys.lists() });
       queryClient.invalidateQueries({ queryKey: nameListKeys.all });
    },
  });
};

export const useChangeCategoryStat = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, StatChangeDto>({
    mutationFn: catApi.changeStat,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catKeys.lists() });
       queryClient.invalidateQueries({ queryKey: nameListKeys.all });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, string>({
    mutationFn: catApi.remove,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catKeys.lists() });
       queryClient.invalidateQueries({ queryKey: nameListKeys.all });
    },
  });
};
