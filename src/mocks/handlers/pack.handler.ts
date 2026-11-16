import { http } from "msw";
import type { PackTypeAddDto, PackTypeModDto } from "@/types/packType";
import type { StatChangeDto } from "@/types/dto";
import { ok, problem, notFound } from "../data/db";

const BASE = "*/item/v1/Pack";

interface MockPackType {
  id: string;
  dateAdd: string;
  dateMod: string | null;
  isDeleted: boolean;
  code: string;
  name: string;
  desc: string;
  isActive: boolean;
}


const seed = (
  id: string,
  code: string,
  name: string,
  isActive = true,
): MockPackType => ({
  id,
  dateAdd: "2026-01-05T09:00:00.000Z",
  dateMod: null,
  isDeleted: false,
  code,
  name,
  desc: `${name} packaging`,
  isActive,
});

export const packTypes: MockPackType[] = [
  seed("pk-100", "BOX", "Box"),
  seed("pk-101", "BAG", "Bag"),
  seed("pk-102", "CTN", "Carton"),
  seed("pk-103", "BTL", "Bottle", false),
];

const toListItem = (p: MockPackType) => ({
  ...p,
  status: p.isActive ? "Active" : "Inactive",
});

const findActive = (id: string) =>
  packTypes.find((p) => p.id === id && !p.isDeleted);

const codeTaken = (code: string, exceptId?: string) =>
  packTypes.some(
    (p) =>
      !p.isDeleted &&
      p.id !== exceptId &&
      p.code.toLowerCase() === code.trim().toLowerCase(),
  );

export const packHandlers = [
  http.get(`${BASE}/AllList`, () =>
    ok(packTypes.filter((p) => !p.isDeleted).map(toListItem)),
  ),

  http.post(`${BASE}/ChangeStat`, async ({ request }) => {
    const { id, stat } = (await request.json()) as StatChangeDto;
    const item = findActive(id);
    if (!item) return notFound("Packaging type");

    item.isActive = stat;
    item.dateMod = new Date().toISOString();
    return ok();
  }),

  http.post(`${BASE}/Add`, async ({ request }) => {
    const body = (await request.json()) as PackTypeAddDto;

    if (!body.code?.trim() || !body.name?.trim()) {
      return problem(400, "Add failed", "Code and name are required.");
    }
    if (codeTaken(body.code)) {
      return problem(
        400,
        "Add failed",
        "A packaging type with this code already exists.",
      );
    }

    packTypes.push({
      id: crypto.randomUUID(),
      dateAdd: new Date().toISOString(),
      dateMod: null,
      isDeleted: false,
      code: body.code.trim(),
      name: body.name.trim(),
      desc: "",
      isActive: true,
    });

    return ok(null, 201);
  }),

  http.put(`${BASE}/Mod/:id`, async ({ request, params }) => {
    const body = (await request.json()) as PackTypeModDto;
    const item = findActive(String(params.id));
    if (!item) return notFound("Packaging type");

    if (codeTaken(body.code, item.id)) {
      return problem(
        400,
        "Update failed",
        "A packaging type with this code already exists.",
      );
    }

    item.code = body.code.trim();
    item.name = body.name.trim();
    item.dateMod = new Date().toISOString();
    return ok();
  }),

  http.delete(`${BASE}/Del/:id`, ({ params }) => {
    const item = findActive(String(params.id));
    if (!item) return notFound("Packaging type");

    item.isDeleted = true;
    return ok();
  }),
];
