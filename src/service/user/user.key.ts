export const userKeys = {
  all: ["users"] as const,

  // customers
  customers: () => [...userKeys.all, "customers"] as const,
  customerLists: () => [...userKeys.customers(), "list"] as const,
  customerDetails: () => [...userKeys.customers(), "detail"] as const,
  customerDetail: (id: string) => [...userKeys.customerDetails(), id] as const,

  // employees
  employees: () => [...userKeys.all, "employees"] as const,
  employeeLists: () => [...userKeys.employees(), "list"] as const,
  employeeDetails: () => [...userKeys.employees(), "detail"] as const,
  employeeDetail: (id: string) => [...userKeys.employeeDetails(), id] as const,
} as const;
