export const proKeys = {
  all: ["products"] as const,
  lists: () => [...proKeys.all, "list"] as const,
  details: () => [...proKeys.all, "detail"] as const,
  detail: (id: string) => [...proKeys.details(), id] as const,
} as const;
