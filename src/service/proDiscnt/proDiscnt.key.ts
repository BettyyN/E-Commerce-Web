export const proDiscntKeys = {
  all: ["proDiscounts"] as const,
  lists: () => [...proDiscntKeys.all, "list"] as const,
  list: () => [...proDiscntKeys.lists(), "all"] as const,
  variant: (variantId: string) =>
    [...proDiscntKeys.lists(), "variant", variantId] as const,
} as const;
