export const myDataKeys = {
  all: ["myData"] as const,

  orders: () => [...myDataKeys.all, "orders"] as const,
  orderList: () => [...myDataKeys.orders(), "list"] as const,
  orderDetail: (id: string) => [...myDataKeys.orders(), "detail", id] as const,

  credits: () => [...myDataKeys.all, "credits"] as const,
  creditList: () => [...myDataKeys.credits(), "list"] as const,
  creditDetail: (id: string) => [...myDataKeys.credits(), "detail", id] as const,
} as const;