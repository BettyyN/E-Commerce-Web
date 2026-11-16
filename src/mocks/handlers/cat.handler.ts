import { http } from "msw";
import type { CatAddDto, CatModDto } from "@/types/category";
import type { StatChangeDto } from "@/types/dto";
import { ok, problem, notFound } from "../data/db";

const BASE = "*/item/v1/Cat";

interface MockCat {
  id: string;
  dateAdd: string;
  dateMod: string | null;
  isDeleted: boolean;
  name: string;
  icon: string;
  isActive: boolean;
}

export const categories: MockCat[] = [
  {
    id: "cat-100",
    dateAdd: "2026-01-05T09:00:00.000Z",
    dateMod: null,
    isDeleted: false,
    name: "Electronics",
    icon: "smartphone",
    isActive: true,
  },
  {
    id: "cat-101",
    dateAdd: "2026-01-12T10:30:00.000Z",
    dateMod: null,
    isDeleted: false,
    name: "Home & Kitchen",
    icon: "home",
    isActive: true,
  },
  {
    id: "cat-102",
    dateAdd: "2026-02-03T14:00:00.000Z",
    dateMod: null,
    isDeleted: false,
    name: "Fashion",
    icon: "shirt",
    isActive: false,
  },
];

const toListItem = (c: MockCat) => ({
  ...c,
  status: c.isActive ? "Active" : "Inactive",
});

const findActive = (id: string) =>
  categories.find((c) => c.id === id && !c.isDeleted);

const nameTaken = (name: string, exceptId?: string) =>
  categories.some(
    (c) =>
      !c.isDeleted &&
      c.id !== exceptId &&
      c.name.toLowerCase() === name.trim().toLowerCase(),
  );

export const catHandlers = [
  http.get(`${BASE}/AllList`, () =>
    ok(categories.filter((c) => !c.isDeleted).map(toListItem)),
  ),

  http.post(`${BASE}/ChangeStat`, async ({ request }) => {
    const { id, stat } = (await request.json()) as StatChangeDto;
    const cat = findActive(id);
    if (!cat) return notFound("Category");

    cat.isActive = stat;
    cat.dateMod = new Date().toISOString();
    return ok();
  }),

  http.post(`${BASE}/Add`, async ({ request }) => {
    const body = (await request.json()) as CatAddDto;

    if (!body.name?.trim()) {
      return problem(400, "Add failed", "Category name is required.");
    }
    if (nameTaken(body.name)) {
      return problem(
        400,
        "Add failed",
        "A category with this name already exists.",
      );
    }

    categories.push({
      id: crypto.randomUUID(),
      dateAdd: new Date().toISOString(),
      dateMod: null,
      isDeleted: false,
      name: body.name.trim(),
      icon: body.icon,
      isActive: true,
    });

    return ok(null, 201);
  }),

  http.put(`${BASE}/Mod/:id`, async ({ request, params }) => {
    const body = (await request.json()) as CatModDto;
    const cat = findActive(String(params.id));
    if (!cat) return notFound("Category");

    if (nameTaken(body.name, cat.id)) {
      return problem(
        400,
        "Update failed",
        "A category with this name already exists.",
      );
    }

    cat.name = body.name.trim();
    cat.icon = body.icon;
    cat.dateMod = new Date().toISOString();
    return ok();
  }),

  http.delete(`${BASE}/Del/:id`, ({ params }) => {
    const cat = findActive(String(params.id));
    if (!cat) return notFound("Category");

    cat.isDeleted = true; // soft delete, same as the bank mock
    return ok();
  }),
];
