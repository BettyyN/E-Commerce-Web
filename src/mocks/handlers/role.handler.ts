import { http } from "msw";
import { roles, ok, notFound } from "../data/db";

const BASE = "*/auth/v1/Role";

export const roleHandlers = [
  http.get(`${BASE}/All`, () => ok(roles)),

  http.get(`${BASE}/Detail/:id`, ({ params }) => {
    const role = roles.find((r) => r.id === params.id);
    return role ? ok(role) : notFound("Role");
  }),
];
