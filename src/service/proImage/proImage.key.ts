export const proImageKeys = {
  all: ["proImages"] as const,
  lists: () => [...proImageKeys.all, "list"] as const,
  list: (productId: string) => [...proImageKeys.lists(), productId] as const,
  files: () => [...proImageKeys.all, "file"] as const,
  file: (id: string) => [...proImageKeys.files(), id] as const,
} as const;
