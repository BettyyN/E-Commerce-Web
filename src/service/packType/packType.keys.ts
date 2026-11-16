export const packKeys = {
  all: ["packTypes"] as const,
  lists: () => [...packKeys.all, "list"] as const,
} as const;
