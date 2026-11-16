import { http } from "msw";
import type { CustomerAddDto, CustomerModDto } from "@/types/customer";
import type { StatChangeDto } from "@/types/dto";
import { customers, statStr, ok, problem, notFound } from "../data/db";

const BASE = "*/auth/v1/Customer";

// blank optional fields are stored as "" so CustomerListDto stays string
const clean = (v?: string | null) => v?.trim() ?? "";

export const customerHandlers = [
  http.get(`${BASE}/All`, () => ok(customers)),

  http.get(`${BASE}/Detail/:id`, ({ params }) => {
    const customer = customers.find((c) => c.id === params.id);
    return customer ? ok(customer) : notFound("Customer");
  }),

  http.post(`${BASE}/ChangeStat`, async ({ request }) => {
    const { id, stat } = (await request.json()) as StatChangeDto;
    const customer = customers.find((c) => c.id === id);
    if (!customer) return notFound("Customer");

    customer.status = statStr(stat);
    return ok();
  }),

  http.post(`${BASE}/Add`, async ({ request }) => {
    const body = (await request.json()) as CustomerAddDto;
    const email = clean(body.email);
    const phoneNum = clean(body.phoneNum);

    if (email && customers.some((c) => c.email === email)) {
      return problem(
        400,
        "Add failed",
        "A customer with this email already exists.",
      );
    }
    if (customers.some((c) => c.phoneNum === phoneNum)) {
      return problem(
        400,
        "Add failed",
        "A customer with this phone number already exists.",
      );
    }

    const now = new Date().toISOString();
    customers.push({
      id: crypto.randomUUID(),
      fullName: body.fullName.trim(),
      email,
      phoneNum,
      tin: clean(body.tin),
      status: "Active",
      isDeleted: false,
      createdAt: now,
      modifiedAt: now,
    });

    return ok(null, 201);
  }),

  http.put(`${BASE}/Mod/:id`, async ({ request, params }) => {
    const body = (await request.json()) as CustomerModDto;
    const customer = customers.find((c) => c.id === params.id);
    if (!customer) return notFound("Customer");

    const email = clean(body.email);
    const phoneNum = clean(body.phoneNum);

    if (
      email &&
      customers.some((c) => c.id !== customer.id && c.email === email)
    ) {
      return problem(
        400,
        "Update failed",
        "A customer with this email already exists.",
      );
    }
    if (
      customers.some((c) => c.id !== customer.id && c.phoneNum === phoneNum)
    ) {
      return problem(
        400,
        "Update failed",
        "A customer with this phone number already exists.",
      );
    }

    customer.fullName = body.fullName.trim();
    customer.email = email;
    customer.phoneNum = phoneNum;
    customer.tin = clean(body.tin);
    customer.modifiedAt = new Date().toISOString();
    return ok();
  }),

  http.delete(`${BASE}/Del/:id`, ({ params }) => {
    const index = customers.findIndex((c) => c.id === params.id);
    if (index === -1) return notFound("Customer");

    customers.splice(index, 1);
    return ok();
  }),
];
