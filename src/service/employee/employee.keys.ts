export const employeeKeys = {
  all: ["employees"] as const,

  lists: () => [...employeeKeys.all, "list"] as const,

  detail: (id: string | number) => [...employeeKeys.all, "detail", id] as const,
};
