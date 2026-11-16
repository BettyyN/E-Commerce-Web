export const nameListKeys = {
  all: ["nameLists"] as const,
  cat: () => [...nameListKeys.all, "cat"] as const,
  catFilter: () => [...nameListKeys.all, "catFilter"] as const,
  measType: () => [...nameListKeys.all, "measType"] as const,
  packType: () => [...nameListKeys.all, "packType"] as const,
  bankIcon: () => [...nameListKeys.all, "bankIcon"] as const,
  icon: (id: string) => [...nameListKeys.all, "icon", id] as const,
} as const;
