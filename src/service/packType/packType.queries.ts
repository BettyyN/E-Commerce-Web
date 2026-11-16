import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nameListKeys } from "../nameList/nameList.key"; // adjust path
import type {
  PackTypeListDto,
  PackTypeAddDto,
  PackTypeModDto,
} from "@/types/packType";
import type { StatChangeDto } from "@/types/dto";
import { packKeys } from "./packType.keys";
import { packApi } from "./packType.api";

const useRefresh = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: packKeys.lists() });
    queryClient.invalidateQueries({ queryKey: nameListKeys.packType() });
  };
};

export const usePackTypes = () =>
  useQuery<PackTypeListDto[], Error>({
    queryKey: packKeys.lists(),
    queryFn: packApi.getAll,
    staleTime: 60 * 60 * 1000,
  });

export const useAddPackType = () => {
  const refresh = useRefresh();
  return useMutation<string | undefined, Error, PackTypeAddDto>({
    mutationFn: packApi.add,
    onSuccess: refresh,
  });
};

export const useUpdatePackType = () => {
  const refresh = useRefresh();
  return useMutation<string | undefined, Error, PackTypeModDto>({
    mutationFn: packApi.modify,
    onSuccess: refresh,
  });
};

export const useChangePackTypeStat = () => {
  const refresh = useRefresh();
  return useMutation<string | undefined, Error, StatChangeDto>({
    mutationFn: packApi.changeStat,
    onSuccess: refresh,
  });
};

export const useDeletePackType = () => {
  const refresh = useRefresh();
  return useMutation<string | undefined, Error, string>({
    mutationFn: packApi.remove,
    onSuccess: refresh,
  });
};
