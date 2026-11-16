export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: () => [...orderKeys.lists(), "all"] as const,
  pending: () => [...orderKeys.lists(), "pending"] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
} as const;
