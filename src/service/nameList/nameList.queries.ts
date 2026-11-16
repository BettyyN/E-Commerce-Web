import { useQuery } from "@tanstack/react-query";
import { nameListApi } from "./nameList.api";
import { nameListKeys } from "./nameList.key";
import type { CatNameList, NameList } from "@/types/dto";
import type { BankIconList } from "@/types/bank";

const STALE = 30 * 60 * 1000; // dropdown data changes rarely

export const useCatNames = () =>
  useQuery<NameList[], Error>({
    queryKey: nameListKeys.cat(),
    queryFn: nameListApi.getCats,
    staleTime: STALE,
  });

export const useCatFilterNames = () =>
  useQuery<CatNameList[], Error>({
    queryKey: nameListKeys.catFilter(),
    queryFn: nameListApi.getCatFilter,
    staleTime: STALE,
  });

export const useMeasTypeNames = () =>
  useQuery<NameList[], Error>({
    queryKey: nameListKeys.measType(),
    queryFn: nameListApi.getMeasTypes,
    staleTime: STALE,
  });

export const usePackTypeNames = () =>
  useQuery<NameList[], Error>({
    queryKey: nameListKeys.packType(),
    queryFn: nameListApi.getPackTypes,
    staleTime: STALE,
  });

export const useBankIconNames = () =>
  useQuery<BankIconList[], Error>({
    queryKey: nameListKeys.bankIcon(),
    queryFn: nameListApi.getBankIcons,
    staleTime: STALE,
  });

// Resolves to an object URL for <img src>
export const useNameListIcon = (id: string | undefined) =>
  useQuery<string, Error>({
    queryKey: nameListKeys.icon(id!),
    queryFn: async () => URL.createObjectURL(await nameListApi.getIcon(id!)),
    enabled: !!id,
    staleTime: Infinity,
  });
