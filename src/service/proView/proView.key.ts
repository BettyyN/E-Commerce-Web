export const proViewKeys = {
  all: ["proViews"] as const,
  lists: () => [...proViewKeys.all, "list"] as const,
  details: () => [...proViewKeys.all, "detail"] as const,
  detail: (id: string) => [...proViewKeys.details(), id] as const,
  images: () => [...proViewKeys.all, "image"] as const,
  image: (id: string) => [...proViewKeys.images(), id] as const,
} as const;
