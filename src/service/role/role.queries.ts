import { useQuery } from "@tanstack/react-query";
import { roleApi } from "./role.api";
import { roleKeys } from "./role.key";
import type { RoleDto } from "@/types/role";

export const useRoles = () => {
  return useQuery<RoleDto[], Error>({
    queryKey: roleKeys.lists(),
    queryFn: roleApi.getAll,
    staleTime: 60 * 60 * 1000, // roles rarely change
  });
};

export const useRole = (id: string | undefined) => {
  return useQuery<RoleDto, Error>({
    queryKey: roleKeys.detail(id!),
    queryFn: () => roleApi.getById(id!),
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  });
};
