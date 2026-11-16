import { http } from "msw";
import type {
  ProDiscntAddDto,
  ProDiscntModDto,
} from "@/types/productDiscount";
import type { StatChangeDto } from "@/types/dto";
import { DiscountTypes } from "@/types/enum";
import { ok, problem, notFound } from "../data/db";
import { money } from "../data/file.utils";
import { productName } from "../data/order.db";
import {
  variants,
  discounts,
  discountedPrice,
  type MockDiscount,
} from "../data/product.db";

const BASE = "*/item/v1/ProDiscnt";

const PERCENTAGE_KEY = Object.entries(DiscountTypes).find(
  ([, label]) => label === "Percentage",
)?.[0];

const FIXED_KEY = Object.entries(DiscountTypes).find(
  ([, label]) => label === "Fixed",
)?.[0];

const TYPES = Object.keys(DiscountTypes);

const getDiscountTypeLabel = (type: string) =>
  DiscountTypes[type as keyof typeof DiscountTypes] ?? type;

const statusOf = (d: MockDiscount) => {
  const now = Date.now();

  if (!d.isActive) return "Inactive";
  if (now < new Date(d.startDate).getTime()) return "Scheduled";
  if (now > new Date(d.endDate).getTime()) return "Expired";

  return "Active";
};

const toVarRow = (d: MockDiscount) => {
  const variant = variants.find((v) => v.id === d.variantId);

  return {
    id: d.id,
    dateAdd: d.dateAdd,
    dateMod: d.dateMod,
    isDeleted: d.isDeleted,
    type: d.type,
    valueStr:
      String(d.type) === PERCENTAGE_KEY
        ? `${d.value}%`
        : money(d.value),
    oldPriceStr: variant ? money(variant.totalPrice) : "",
    newPriceStr: variant ? money(discountedPrice(variant, d)) : "",
    status: statusOf(d),
    startDateAt: d.startDate,
    endDateAt: d.endDate,
  };
};

const toListItem = (d: MockDiscount) => ({
  ...toVarRow(d),
  variant: productName(d.variantId),
});

const findActive = (id: string) =>
  discounts.find((d) => d.id === id && !d.isDeleted);

const validate = (
  body: {
    type: string;
    value: number;
    startDate: string;
    endDate: string;
  },
  variantId: string,
  exceptId?: string,
) => {
  const variant = variants.find(
    (v) => v.id === variantId && !v.isDeleted,
  );

  if (!variant) return "The variant was not found.";

  if (!TYPES.includes(String(body.type))) {
    return `Type must be ${TYPES.map(getDiscountTypeLabel).join(" or ")}.`;
  }

  if (!(body.value > 0)) {
    return "Discount value must be greater than zero.";
  }

  if (String(body.type) === PERCENTAGE_KEY && body.value >= 100) {
    return "A percentage discount must be below 100.";
  }

  if (String(body.type) === FIXED_KEY && body.value >= variant.totalPrice) {
    return "A fixed discount must be lower than the price.";
  }

  const start = new Date(body.startDate);
  const end = new Date(body.endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return "Dates are not valid.";
  }

  if (end <= start) {
    return "End date must be after the start date.";
  }

  const overlaps = discounts.some(
    (d) =>
      !d.isDeleted &&
      d.isActive &&
      d.id !== exceptId &&
      d.variantId === variantId &&
      start <= new Date(d.endDate) &&
      end >= new Date(d.startDate),
  );

  if (overlaps) {
    return "This variant already has an active discount in that period.";
  }

  return null;
};

const listResponse = (
  rows: MockDiscount[],
  map: (d: MockDiscount) => unknown,
) => ok(rows.map(map));

export const proDiscntHandlers = [
  http.get(`${BASE}/AllList`, () =>
    listResponse(
      discounts.filter((d) => !d.isDeleted),
      toListItem,
    ),
  ),

  // id = variant id
  http.get(`${BASE}/VarList/:id`, ({ params }) => {
    if (!variants.some((v) => v.id === params.id && !v.isDeleted)) {
      return notFound("Variant");
    }

    return listResponse(
      discounts.filter(
        (d) => d.variantId === params.id && !d.isDeleted,
      ),
      toVarRow,
    );
  }),

  http.post(`${BASE}/ChangeStat`, async ({ request }) => {
    const { id, stat } = (await request.json()) as StatChangeDto;
    const discount = findActive(id);

    if (!discount) return notFound("Discount");

    discount.isActive = stat;
    discount.dateMod = new Date().toISOString();

    return ok();
  }),

  http.post(`${BASE}/Add`, async ({ request }) => {
    const body = (await request.json()) as ProDiscntAddDto;

    const error = validate(body, body.variantId);

    if (error) {
      return problem(400, "Add failed", error);
    }

    discounts.push({
      id: crypto.randomUUID(),
      dateAdd: new Date().toISOString(),
      dateMod: null,
      isDeleted: false,
      variantId: body.variantId,
      type: String(body.type) as MockDiscount["type"],
      value: body.value,
      startDate: body.startDate,
      endDate: body.endDate,
      isActive: true,
    });

    return ok(null, 201);
  }),

  http.put(`${BASE}/Mod/:id`, async ({ request, params }) => {
    const body = (await request.json()) as ProDiscntModDto;
    const discount = findActive(String(params.id));

    if (!discount) return notFound("Discount");

    const error = validate(body, discount.variantId, discount.id);

    if (error) {
      return problem(400, "Update failed", error);
    }

    Object.assign(discount, {
      type: String(body.type) as MockDiscount["type"],
      value: body.value,
      startDate: body.startDate,
      endDate: body.endDate,
      dateMod: new Date().toISOString(),
    });

    return ok();
  }),

  http.delete(`${BASE}/Del/:id`, ({ params }) => {
    const discount = findActive(String(params.id));

    if (!discount) return notFound("Discount");

    discount.isDeleted = true;

    return ok();
  }),
];
