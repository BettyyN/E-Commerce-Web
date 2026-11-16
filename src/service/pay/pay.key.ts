export const payKeys = {
  all: ["payments"] as const,
  order: (orderId: string) => [...payKeys.all, "order", orderId] as const,
  orderReceipt: (id: string) => [...payKeys.all, "orderReceipt", id] as const,
  credit: (creditId: string) => [...payKeys.all, "credit", creditId] as const,
  creditPending: (creditId: string) =>
    [...payKeys.all, "creditPending", creditId] as const,
  creditReceipt: (id: string) => [...payKeys.all, "creditReceipt", id] as const,
} as const;
