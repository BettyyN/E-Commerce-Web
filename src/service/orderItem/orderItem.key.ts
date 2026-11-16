export const orderItemKeys = {
  all: ["orderItems"] as const,
  lists: () => [...orderItemKeys.all, "list"] as const,
  list: (orderId: string) => [...orderItemKeys.lists(), orderId] as const,
  details: () => [...orderItemKeys.all, "detail"] as const,
  detail: (id: string) => [...orderItemKeys.details(), id] as const,
} as const;
