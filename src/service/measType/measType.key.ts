export const measTypeKeys = {
  all: ["measTypes"] as const,
  lists: () => [...measTypeKeys.all, "list"] as const,
} as const;
