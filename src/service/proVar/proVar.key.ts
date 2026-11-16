export const proVarKeys = {
  all: ["proVariants"] as const,
  lists: () => [...proVarKeys.all, "list"] as const,
  list: (productId: string) => [...proVarKeys.lists(), productId] as const,
  details: () => [...proVarKeys.all, "detail"] as const,
  detail: (id: string) => [...proVarKeys.details(), id] as const,
} as const;
