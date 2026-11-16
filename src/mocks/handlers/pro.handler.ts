import { http } from "msw";
import type { ProAddDto, ProModDto } from "@/types/product";
import type { StatChangeDto } from "@/types/dto";
import { ok, problem, notFound } from "../data/db";
import {
  products,
  variants,
  discounts,
  images,
  type MockProduct,
} from "../data/product.db";
import { categories } from "./cat.handler";

const BASE = "*/item/v1/Pro";

const categoryName = (id: string) =>
  categories.find((c) => c.id === id)?.name ?? "";

const toListItem = (p: MockProduct) => ({
  id: p.id,
  dateAdd: p.dateAdd,
  dateMod: p.dateMod,
  isDeleted: p.isDeleted,
  name: p.name,
  category: categoryName(p.categoryId),
  isPerishableStr: p.isPerishable ? "Yes" : "No",
  status: p.isActive ? "Active" : "Inactive",
});

const toDashboard = (p: MockProduct) => ({
  ...toListItem(p),
  desc: p.desc,
  shortDesc: p.shortDesc,
  brand: p.brand,
  originCountry: p.originCountry,
  ingredients: p.ingredients,
  storageInst: p.storageInst,
});

const findActive = (id: string) =>
  products.find((p) => p.id === id && !p.isDeleted);

const validate = (body: ProAddDto | ProModDto, exceptId?: string) => {
  if (!body.name?.trim()) return "Product name is required.";
  if (!categories.some((c) => c.id === body.categoryId && !c.isDeleted)) {
    return "The selected category does not exist.";
  }
  if (
    products.some(
      (p) =>
        !p.isDeleted &&
        p.id !== exceptId &&
        p.name.toLowerCase() === body.name.trim().toLowerCase(),
    )
  ) {
    return "A product with this name already exists.";
  }
  return null;
};

export const proHandlers = [
  http.get(`${BASE}/AllList`, () =>
    ok(products.filter((p) => !p.isDeleted).map(toListItem)),
  ),

  http.get(`${BASE}/DashBrd/:id`, ({ params }) => {
    const product = findActive(String(params.id));
    return product ? ok(toDashboard(product)) : notFound("Product");
  }),

  http.post(`${BASE}/ChangeStat`, async ({ request }) => {
    const { id, stat } = (await request.json()) as StatChangeDto;
    const product = findActive(id);
    if (!product) return notFound("Product");

    product.isActive = stat;
    product.dateMod = new Date().toISOString();
    return ok();
  }),

  http.post(`${BASE}/Add`, async ({ request }) => {
    const body = (await request.json()) as ProAddDto;

    const error = validate(body);
    if (error) return problem(400, "Add failed", error);

    products.push({
      id: crypto.randomUUID(),
      dateAdd: new Date().toISOString(),
      dateMod: null,
      isDeleted: false,
      name: body.name.trim(),
      isPerishable: body.isPerishable,
      categoryId: body.categoryId,
      desc: body.desc ?? "",
      shortDesc: body.shortDesc ?? "",
      brand: body.brand ?? "",
      originCountry: body.originCountry ?? "",
      ingredients: body.ingredients ?? "",
      storageInst: body.storageInst ?? "",
      isActive: true,
    });

    return ok(null, 201);
  }),

  http.put(`${BASE}/Mod/:id`, async ({ request, params }) => {
    const body = (await request.json()) as ProModDto;
    const product = findActive(String(params.id));
    if (!product) return notFound("Product");

    const error = validate(body, product.id);
    if (error) return problem(400, "Update failed", error);

    Object.assign(product, {
      name: body.name.trim(),
      isPerishable: body.isPerishable,
      categoryId: body.categoryId,
      desc: body.desc ?? "",
      shortDesc: body.shortDesc ?? "",
      brand: body.brand ?? "",
      originCountry: body.originCountry ?? "",
      ingredients: body.ingredients ?? "",
      storageInst: body.storageInst ?? "",
      dateMod: new Date().toISOString(),
    });

    return ok();
  }),

  // Soft delete; the product's variants, their discounts and its images go with it
  http.delete(`${BASE}/Del/:id`, ({ params }) => {
    const product = findActive(String(params.id));
    if (!product) return notFound("Product");

    product.isDeleted = true;

    variants
      .filter((v) => v.productId === product.id)
      .forEach((v) => {
        v.isDeleted = true;
        discounts
          .filter((d) => d.variantId === v.id)
          .forEach((d) => (d.isDeleted = true));
      });
    images
      .filter((i) => i.productId === product.id)
      .forEach((i) => (i.isDeleted = true));

    return ok();
  }),
];
