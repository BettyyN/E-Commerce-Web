export const catKeys = {
  all: ["categories"] as const,
  lists: () => [...catKeys.all, "list"] as const,
} as const;
