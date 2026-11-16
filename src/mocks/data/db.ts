import { HttpResponse } from "msw";
import type { CustomerListDto } from "@/types/customer";
import type { EmployeeListDto } from "@/types/employee";
import type { RoleDto } from "@/types/role";

export const roles: RoleDto[] = [
  {
    id: "r-admin",
    role: "Admin",
  },
  { id: "r-mngr", role: "Manager" },
  { id: "r-emp", role: "Employee" },
  { id: "r-cust", role: "Customer" },
];

const at = "2026-01-05T09:00:00.000Z";

// ids match the eId / cId claims in the auth mock tokens
export const employees: EmployeeListDto[] = [
  {
    id: "e-100",
    fullName: "Sales User",
    email: "sales@gmail.com",
    role: "emp",
    status: "Active",
    isDeleted: false,
    createdAt: at,
    modifiedAt: at,
  },
  {
    id: "e-101",
    fullName: "Sara Tesfaye",
    email: "sara@elutrading.com",
    role: "mngr",
    status: "Active",
    isDeleted: false,
    createdAt: at,
    modifiedAt: at,
  },
  {
    id: "e-102",
    fullName: "Dawit Alemu",
    email: "dawit@elutrading.com",
    role: "emp",
    status: "In-active",
    isDeleted: false,
    createdAt: at,
    modifiedAt: at,
  },
];

export const customers: CustomerListDto[] = [
  {
    id: "c-100",
    fullName: "Customer User",
    email: "user@gmail.com",
    phoneNum: "+251911234567",
    tin: "0112233445",
    status: "Active",
    isDeleted: false,
    createdAt: at,
    modifiedAt: at,
  },
  {
    id: "c-101",
    fullName: "Abebe Kebede",
    email: "abebe@example.com",
    phoneNum: "+251922334455",
    tin: "0112233446",
    status: "In-active",
    isDeleted: false,
    createdAt: at,
    modifiedAt: at,
  },
  {
    id: "c-102",
    fullName: "Hana Bekele",
    email: "hana@example.com",
    phoneNum: "+251933445566",
    tin: "0112233447",
    status: "Active",
    isDeleted: false,
    createdAt: at,
    modifiedAt: at,
  },
];

/* ---------- helpers ---------- */

export const statStr = (active: boolean) =>
  active ? "Active" : "In-active";

export const ok = (data: unknown = null, status = 200) =>
  HttpResponse.json({ data, message: "Success" }, { status });

export const problem = (status: number, title: string, detail: string) =>
  HttpResponse.json(
    { type: `https://example.com/errors/${status}`, title, status, detail },
    { status },
  );

export const notFound = (what: string) =>
  problem(404, "Not found", `${what} was not found.`);
