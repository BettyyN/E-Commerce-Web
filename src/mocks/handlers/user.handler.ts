import { http } from "msw";
import type { StatChangeDto } from "@/types/dto";
import {
  customers,
  employees,
  statStr,
  ok,
  problem,
  notFound,
} from "../data/db";

const BASE = "*/auth/v1/User";

export const userHandlers = [
  /* ---------- Customers ---------- */

  http.get(`${BASE}/AllCust`, () => ok(customers)),

  http.get(`${BASE}/CustDetail/:id`, ({ params }) => {
    const customer = customers.find((c) => c.id === params.id);
    return customer ? ok(customer) : notFound("Customer");
  }),

  http.post(`${BASE}/StatCust`, async ({ request }) => {
    const { id, stat } = (await request.json()) as StatChangeDto;
    const customer = customers.find((c) => c.id === id);
    if (!customer) return notFound("Customer");

    customer.status = statStr(stat);
    return ok();
  }),

  /* ---------- Employees ---------- */

  http.get(`${BASE}/AllEmp`, () => ok(employees)),

  http.get(`${BASE}/DetailEmp/:id`, ({ params }) => {
    const employee = employees.find((e) => e.id === params.id);
    return employee ? ok(employee) : notFound("Employee");
  }),

  http.post(`${BASE}/StatEmp`, async ({ request }) => {
    const { id, stat } = (await request.json()) as StatChangeDto;
    const employee = employees.find((e) => e.id === id);
    if (!employee) return notFound("Employee");

    employee.status = statStr(stat);
    return ok();
  }),

  /* ---------- Shared ---------- */

  // Removes the id from whichever list contains it
  http.delete(`${BASE}/Del/:id`, ({ params }) => {
    const custIndex = customers.findIndex((c) => c.id === params.id);
    if (custIndex !== -1) {
      customers.splice(custIndex, 1);
      return ok();
    }

    const empIndex = employees.findIndex((e) => e.id === params.id);
    if (empIndex !== -1) {
      employees.splice(empIndex, 1);
      return ok();
    }

    return notFound("User");
  }),

  http.put(`${BASE}/ChangePwd`, async ({ request }) => {
    const { oldPwd, newPwd } = (await request.json()) as {
      oldPwd?: string | null;
      newPwd?: string | null;
    };

    if (!oldPwd || !newPwd) {
      return problem(
        400,
        "Change failed",
        "Old and new password are required.",
      );
    }
    if (newPwd.length < 6) {
      return problem(
        400,
        "Change failed",
        "New password must be at least 6 characters.",
      );
    }

    return ok(null, 201);
  }),
];
