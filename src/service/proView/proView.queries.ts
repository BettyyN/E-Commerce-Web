import { useQuery } from "@tanstack/react-query";
import { proViewApi } from "./proView.api";
import { proViewKeys } from "./proView.key";
import type { ProViewListDto, ProViewDetailDto } from "@/types/proView";

const STALE = 60 * 1000;

export const useProViews = () =>
  useQuery<ProViewListDto[], Error>({
    queryKey: proViewKeys.lists(),
    queryFn: proViewApi.getAll,
    staleTime: STALE,
  });

export const useProViewDetail = (id: string | undefined) =>
  useQuery<ProViewDetailDto, Error>({
    queryKey: proViewKeys.detail(id!),
    queryFn: () => proViewApi.getDetail(id!),
    enabled: !!id,
    staleTime: STALE,
  });

// Resolves to an object URL for <img src>
export const useProViewImage = (id: string | undefined) =>
  useQuery<string, Error>({
    queryKey: proViewKeys.image(id!),
    queryFn: async () => URL.createObjectURL(await proViewApi.getImage(id!)),
    enabled: !!id,
    staleTime: Infinity,
  });

  export const useProViewImages = (id: string | undefined) =>
    useQuery<string, Error>({
      queryKey: proViewKeys.image(id!),
      queryFn: async () => URL.createObjectURL(await proViewApi.getImages(id!)),
      enabled: !!id,
      staleTime: Infinity,
    });
