export const creditKeys = {
  all: ["credits"] as const,
  lists: () => [...creditKeys.all, "list"] as const,
  paid: () => [...creditKeys.lists(), "paid"] as const,
  unpaid: () => [...creditKeys.lists(), "unpaid"] as const,
  details: () => [...creditKeys.all, "detail"] as const,
  detail: (id: string) => [...creditKeys.details(), id] as const,
  byOrder: (orderId: string) =>
    [...creditKeys.all, "byOrder", orderId] as const,
} as const;
