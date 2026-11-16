import { http, HttpResponse } from "msw";
import type {
  ProVarAddDto,
  ProVarModDto,
  ProVarPriceDto,
  ProVarQtyDto,
} from "@/types/productVariant";
import type { StatChangeDto } from "@/types/dto";
import { ok, problem, notFound } from "../data/db";
import { money } from "../data/file.utils";
import {
  products,
  variants,
  discounts,
  splitPrice,
  type MockVariant,
} from "../data/product.db";
import { measTypes } from "./measType.handler";
import { packTypes } from "./pack.handler";

const BASE = "*/item/v1/ProVar";

const measName = (id: string) => measTypes.find((m) => m.id === id)?.name ?? "";
const packName = (id: string) => packTypes.find((p) => p.id === id)?.name ?? "";

const toListItem = (v: MockVariant) => ({
  id: v.id,
  dateAdd: v.dateAdd,
  dateMod: v.dateMod,
  isDeleted: v.isDeleted,
  sortOrder: v.sortOrder,
  itemPkg: v.itemPkg,
  name: v.name,
  totPrice: money(v.totalPrice),
  quantity: v.quantity,
  qtyStr: `${v.quantity.toLocaleString("en-US")} ${packName(v.packagingTypeId)}`,
  measType: measName(v.measTypeId),
  packagingType: packName(v.packagingTypeId),
  isDefaultStr: v.isDefault ? "Yes" : "No",
  status: v.isActive ? "Active" : "Inactive",
});

const toDetail = (v: MockVariant) => {
  const { price, vat } = splitPrice(v.totalPrice);

  return {
    ...toListItem(v),
    batchNumber: v.batchNumber,
    priceStr: money(price),
    vatStr: money(vat),
    manufactureAt: v.manufactureDate ?? "",
    expireAt: v.expireDate ?? "",
  };
};

const findActive = (id: string) =>
  variants.find((v) => v.id === id && !v.isDeleted);

const validate = (body: Omit<ProVarModDto, "id">) => {
  if (!body.name?.trim()) return "Variant name is required.";
  if (!body.itemPkg?.trim()) return "Item package is required.";
  if (!Number.isInteger(body.sortOrder) || body.sortOrder < 0) {
    return "Sort order must be a whole number, zero or more.";
  }
  if (!measTypes.some((m) => m.id === body.measTypeId && !m.isDeleted)) {
    return "The selected measurement type does not exist.";
  }
  if (!packTypes.some((p) => p.id === body.packagingTypeId && !p.isDeleted)) {
    return "The selected packaging type does not exist.";
  }
  if (
    body.manufactureDate &&
    body.expireDate &&
    new Date(body.expireDate) <= new Date(body.manufactureDate)
  ) {
    return "Expiry date must be after the manufacture date.";
  }
  return null;
};

const setDefault = (variant: MockVariant) => {
  variants
    .filter((v) => v.productId === variant.productId)
    .forEach((v) => (v.isDefault = v.id === variant.id));
};

export const proVarHandlers = [
  // id = product id
  http.get(`${BASE}/AllList/:id`, ({ params }) => {
    if (!products.some((p) => p.id === params.id && !p.isDeleted))
      return notFound("Product");

    const rows = variants
      .filter((v) => v.productId === params.id && !v.isDeleted)
      .sort(
        (a, b) =>
          Number(b.isDefault) - Number(a.isDefault) ||
          a.sortOrder - b.sortOrder,
      )
      .map(toListItem);

    return rows.length > 0 ? ok(rows) : new HttpResponse(null, { status: 204 });
  }),

  // id = variant id
  http.get(`${BASE}/Detail/:id`, ({ params }) => {
    const variant = findActive(String(params.id));
    return variant ? ok(toDetail(variant)) : notFound("Variant");
  }),

  http.post(`${BASE}/UpdatePrc`, async ({ request }) => {
    const { id, totalPrice } = (await request.json()) as ProVarPriceDto;
    const variant = findActive(id);
    if (!variant) return notFound("Variant");
    if (!(totalPrice > 0))
      return problem(400, "Update failed", "Price must be greater than zero.");

    variant.totalPrice = totalPrice;
    variant.dateMod = new Date().toISOString();
    return ok(null, 201);
  }),

  http.post(`${BASE}/UpdateQty`, async ({ request }) => {
    const { id, quantity } = (await request.json()) as ProVarQtyDto;
    const variant = findActive(id);
    if (!variant) return notFound("Variant");
    if (!Number.isInteger(quantity) || quantity < 0) {
      return problem(
        400,
        "Update failed",
        "Quantity must be a whole number, zero or more.",
      );
    }

    variant.quantity = quantity;
    variant.dateMod = new Date().toISOString();
    return ok(null, 201);
  }),

  // DELETE by design: makes this variant the product's default
  http.delete(`${BASE}/ChangeDef/:id`, ({ params }) => {
    const variant = findActive(String(params.id));
    if (!variant) return notFound("Variant");

    setDefault(variant);
    return ok();
  }),

  http.post(`${BASE}/ChangeStat`, async ({ request }) => {
    const { id, stat } = (await request.json()) as StatChangeDto;
    const variant = findActive(id);
    if (!variant) return notFound("Variant");

    variant.isActive = stat;
    variant.dateMod = new Date().toISOString();
    return ok();
  }),

  http.post(`${BASE}/Add`, async ({ request }) => {
    const body = (await request.json()) as ProVarAddDto;

    if (!products.some((p) => p.id === body.productId && !p.isDeleted)) {
      return problem(400, "Add failed", "The product was not found.");
    }
    const error = validate(body);
    if (error) return problem(400, "Add failed", error);

    const isFirst = !variants.some(
      (v) => v.productId === body.productId && !v.isDeleted,
    );

    const variant: MockVariant = {
      id: crypto.randomUUID(),
      dateAdd: new Date().toISOString(),
      dateMod: null,
      isDeleted: false,
      productId: body.productId,
      sortOrder: body.sortOrder,
      itemPkg: body.itemPkg.trim(),
      name: body.name.trim(),
      batchNumber: body.batchNumber ?? "",
      quantity: body.quantity,
      totalPrice: body.totalPrice,
      measTypeId: body.measTypeId,
      packagingTypeId: body.packagingTypeId,
      manufactureDate: body.manufactureDate,
      expireDate: body.expireDate,
      isDefault: false,
      isActive: true,
    };

    variants.push(variant);
    if (body.isDefault || isFirst) setDefault(variant); // a product's first variant is always the default

    return ok(null, 201);
  }),

  http.put(`${BASE}/Mod/:id`, async ({ request, params }) => {
    const body = (await request.json()) as ProVarModDto;
    const variant = findActive(String(params.id));
    if (!variant) return notFound("Variant");

    const error = validate(body);
    if (error) return problem(400, "Update failed", error);

    Object.assign(variant, {
      sortOrder: body.sortOrder,
      itemPkg: body.itemPkg.trim(),
      name: body.name.trim(),
      batchNumber: body.batchNumber ?? "",
      manufactureDate: body.manufactureDate,
      expireDate: body.expireDate,
      packagingTypeId: body.packagingTypeId,
      measTypeId: body.measTypeId,
      dateMod: new Date().toISOString(),
    });

    return ok();
  }),

  http.delete(`${BASE}/Del/:id`, ({ params }) => {
    const variant = findActive(String(params.id));
    if (!variant) return notFound("Variant");

    variant.isDeleted = true;
    discounts
      .filter((d) => d.variantId === variant.id)
      .forEach((d) => (d.isDeleted = true));

    // the product must always keep a default variant while it has any
    if (variant.isDefault) {
      variant.isDefault = false;
      const next = variants.find(
        (v) => v.productId === variant.productId && !v.isDeleted,
      );
      if (next) setDefault(next);
    }

    return ok();
  }),
];
