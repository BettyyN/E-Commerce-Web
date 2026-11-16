import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bankApi } from "./bank.api";
import { bankKeys } from "./bank.key";
import type {
  BankListDto,
  BankDetailDto,
  BankAddDto,
  BankModDto,
} from "@/types/bank";
import type { StatChangeDto } from "@/types/dto";
import { nameListKeys } from "../nameList/nameList.key";

export const useBanks = () => {
  return useQuery<BankListDto[], Error>({
    queryKey: bankKeys.lists(),
    queryFn: bankApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useBank = (id: string | undefined) => {
  return useQuery<BankDetailDto, Error>({
    queryKey: bankKeys.detail(id!),
    queryFn: () => bankApi.getById(id!),
    enabled: !!id,
  });
};

// Resolves to an object URL you can put straight into <img src>
export const useBankIcon = (id: string | undefined) => {
  return useQuery<string, Error>({
    queryKey: bankKeys.icon(id!),
    queryFn: async () => URL.createObjectURL(await bankApi.getIcon(id!)),
    enabled: !!id,
    staleTime: Infinity,
  });
};

export const useAddBank = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, BankAddDto>({
    mutationFn: bankApi.add,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.lists() });
       queryClient.invalidateQueries({ queryKey: nameListKeys.all });
    },
  });
};

export const useUpdateBank = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, BankModDto>({
    mutationFn: bankApi.modify,

    onSuccess: () => {
      // list, detail and the cached icon may all have changed
      queryClient.invalidateQueries({ queryKey: bankKeys.all });
       queryClient.invalidateQueries({ queryKey: nameListKeys.all });
    },
  });
};

export const useChangeBankStat = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, StatChangeDto>({
    mutationFn: bankApi.changeStat,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.all });
       queryClient.invalidateQueries({ queryKey: nameListKeys.all });
    },
  });
};

export const useDeleteBank = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, string>({
    mutationFn: bankApi.remove,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.all });
       queryClient.invalidateQueries({ queryKey: nameListKeys.all });
    },
  });
};
