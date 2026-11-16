import { http } from "msw";
import type { MeasTypeAddDto, MeasTypeModDto } from "@/types/measType";
import type { StatChangeDto } from "@/types/dto";
import { ok, problem, notFound } from "../data/db";

const BASE = "*/item/v1/MeasType";

interface MockMeasType {
  id: string;
  dateAdd: string;
  dateMod: string | null;
  isDeleted: boolean;
  code: string;
  name: string;
  isActive: boolean;
}

const seed = (
  id: string,
  code: string,
  name: string,
  isActive = true,
): MockMeasType => ({
  id,
  dateAdd: "2026-01-05T09:00:00.000Z",
  dateMod: null,
  isDeleted: false,
  code,
  name,
  isActive,
});

export const measTypes: MockMeasType[] = [
  seed("mt-100", "KG", "Kilogram"),
  seed("mt-101", "PCS", "Piece"),
  seed("mt-102", "L", "Liter"),
  seed("mt-103", "M", "Meter", false),
];

const toListItem = (m: MockMeasType) => ({
  ...m,
  status: m.isActive ? "Active" : "Inactive",
});

const findActive = (id: string) =>
  measTypes.find((m) => m.id === id && !m.isDeleted);

const codeTaken = (code: string, exceptId?: string) =>
  measTypes.some(
    (m) =>
      !m.isDeleted &&
      m.id !== exceptId &&
      m.code.toLowerCase() === code.trim().toLowerCase(),
  );

export const measTypeHandlers = [
  http.get(`${BASE}/AllList`, () =>
    ok(measTypes.filter((m) => !m.isDeleted).map(toListItem)),
  ),

  http.post(`${BASE}/ChangeStat`, async ({ request }) => {
    const { id, stat } = (await request.json()) as StatChangeDto;
    const item = findActive(id);
    if (!item) return notFound("Measurement type");

    item.isActive = stat;
    item.dateMod = new Date().toISOString();
    return ok();
  }),

  http.post(`${BASE}/Add`, async ({ request }) => {
    const body = (await request.json()) as MeasTypeAddDto;

    if (!body.code?.trim() || !body.name?.trim()) {
      return problem(400, "Add failed", "Code and name are required.");
    }
    if (codeTaken(body.code)) {
      return problem(
        400,
        "Add failed",
        "A measurement type with this code already exists.",
      );
    }

    measTypes.push({
      id: crypto.randomUUID(),
      dateAdd: new Date().toISOString(),
      dateMod: null,
      isDeleted: false,
      code: body.code.trim(),
      name: body.name.trim(),
      isActive: true,
    });

    return ok(null, 201);
  }),

  http.put(`${BASE}/Mod/:id`, async ({ request, params }) => {
    const body = (await request.json()) as MeasTypeModDto;
    const item = findActive(String(params.id));
    if (!item) return notFound("Measurement type");

    if (codeTaken(body.code, item.id)) {
      return problem(
        400,
        "Update failed",
        "A measurement type with this code already exists.",
      );
    }

    item.code = body.code.trim();
    item.name = body.name.trim();
    item.dateMod = new Date().toISOString();
    return ok();
  }),

  http.delete(`${BASE}/Del/:id`, ({ params }) => {
    const item = findActive(String(params.id));
    if (!item) return notFound("Measurement type");

    item.isDeleted = true; // soft delete, same as the other mocks
    return ok();
  }),
];
