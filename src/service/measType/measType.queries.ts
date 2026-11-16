import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { measTypeApi } from "./measType.api";
import { measTypeKeys } from "./measType.key";
import type {
  MeasTypeListDto,
  MeasTypeAddDto,
  MeasTypeModDto,
} from "@/types/measType";
import type { StatChangeDto } from "@/types/dto";
import { nameListKeys } from "../nameList/nameList.key";

export const useMeasTypes = () => {
  return useQuery<MeasTypeListDto[], Error>({
    queryKey: measTypeKeys.lists(),
    queryFn: measTypeApi.getAll,
    staleTime: 60 * 60 * 1000, // units rarely change
  });
};

export const useAddMeasType = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, MeasTypeAddDto>({
    mutationFn: measTypeApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: measTypeKeys.lists() });
       queryClient.invalidateQueries({ queryKey: nameListKeys.all });
    },
  });
};

export const useUpdateMeasType = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, MeasTypeModDto>({
    mutationFn: measTypeApi.modify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: measTypeKeys.lists() });
       queryClient.invalidateQueries({ queryKey: nameListKeys.all });
    },
  });
};

export const useChangeMeasTypeStat = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, StatChangeDto>({
    mutationFn: measTypeApi.changeStat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: measTypeKeys.lists() });
       queryClient.invalidateQueries({ queryKey: nameListKeys.all });
    },
  });
};

export const useDeleteMeasType = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, string>({
    mutationFn: measTypeApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: measTypeKeys.lists() });
       queryClient.invalidateQueries({ queryKey: nameListKeys.all });
    },
  });
};
