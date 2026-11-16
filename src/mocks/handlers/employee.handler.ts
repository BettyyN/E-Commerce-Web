import { http } from "msw";
import type { EmployeeAddDto, EmployeeModDto } from "@/types/employee";
import type { StatChangeDto } from "@/types/dto";
import { employees, roles, statStr, ok, problem, notFound } from "../data/db";

const BASE = "*/auth/v1/Employee";

export const employeeHandlers = [
  http.get(`${BASE}/All`, () => ok(employees)),

  http.get(`${BASE}/Detail/:id`, ({ params }) => {
    const employee = employees.find((e) => e.id === params.id);
    return employee ? ok(employee) : notFound("Employee");
  }),

  http.post(`${BASE}/ChangeStat`, async ({ request }) => {
    const { id, stat } = (await request.json()) as StatChangeDto;
    const employee = employees.find((e) => e.id === id);
    if (!employee) return notFound("Employee");

    employee.status = statStr(stat);
    return ok();
  }),

  http.post(`${BASE}/Add`, async ({ request }) => {
    const body = (await request.json()) as EmployeeAddDto;

    if (employees.some((e) => e.email === body.email)) {
      return problem(
        400,
        "Add failed",
        "An employee with this email already exists.",
      );
    }

    const role = roles.find((r) => r.id === body.roleId);
    if (!role)
      return problem(400, "Add failed", "Selected role does not exist.");

    const now = new Date().toISOString();
    employees.push({
      id: crypto.randomUUID(),
      fullName: body.fullName,
      email: body.email,
      role: role.role,
      status: statStr(true),
      isDeleted: false,
      createdAt: now,
      modifiedAt: now,
    });

    return ok(null, 201);
  }),

  http.put(`${BASE}/Mod/:id`, async ({ request, params }) => {
    const body = (await request.json()) as EmployeeModDto;
    const employee = employees.find((e) => e.id === params.id);
    if (!employee) return notFound("Employee");

    employee.fullName = body.fullName;
    employee.email = body.email;
    return ok();
  }),

  http.delete(`${BASE}/Del/:id`, ({ params }) => {
    const index = employees.findIndex((e) => e.id === params.id);
    if (index === -1) return notFound("Employee");

    employees.splice(index, 1);
    return ok();
  }),
];
