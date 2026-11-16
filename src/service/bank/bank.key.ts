export const bankKeys = {
  all: ["banks"] as const,
  lists: () => [...bankKeys.all, "list"] as const,
  details: () => [...bankKeys.all, "detail"] as const,
  detail: (id: string) => [...bankKeys.details(), id] as const,
  icons: () => [...bankKeys.all, "icon"] as const,
  icon: (id: string) => [...bankKeys.icons(), id] as const,
} as const;
