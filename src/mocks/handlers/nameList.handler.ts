import { http, HttpResponse } from "msw";
import { ok, notFound } from "../data/db";
import { categories } from "./cat.handler";
import { measTypes } from "./measType.handler";
import { banks } from "./bank.handler";
import { packTypes } from "./pack.handler";

const BASE = "*/item/v1/NameList";


const activeCats = () =>
  categories
    .filter((c) => !c.isDeleted && c.isActive)
    .map((c) => ({ id: c.id, name: c.name }));

export const nameListHandlers = [
  http.get(`${BASE}/Cat`, () => ok(activeCats())),

  // Assumed to be the storefront filter list; the mock returns the same active categories
  http.get(`${BASE}/CatFilter`, () => ok(activeCats())),

  http.get(`${BASE}/MeasType`, () =>
    ok(
      measTypes
        .filter((m) => !m.isDeleted && m.isActive)
        .map((m) => ({ id: m.id, name: m.name })),
    ),
  ),

  http.get(`${BASE}/PackType`, () =>
    ok(
      packTypes
        .filter((p) => !p.isDeleted && p.isActive)
        .map((p) => ({ id: p.id, name: p.name })),
    ),
  ),

  http.get(`${BASE}/BankIcon`, () =>
    ok(
      banks
        .filter((b) => !b.isDeleted && b.isActive)
        .map((b) => ({ id: b.id, name: b.name })),
    ),
  ),

  // Bank icon image by bank id
  http.get(`${BASE}/GetIcon/:id`, async ({ params }) => {
    const bank = banks.find((b) => b.id === params.id && !b.isDeleted);
    if (!bank) return notFound("Icon");

    const blob = await (await fetch(bank.icon)).blob();
    return new HttpResponse(blob, {
      headers: { "Content-Type": blob.type || "image/png" },
    });
  }),
];
