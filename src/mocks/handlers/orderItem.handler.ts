import { http } from "msw";
import { ok, notFound } from "../data/db";
import {
  orders,
  money,
  productName,
  type MockOrder,
  type MockOrderItem,
} from "../data/order.db";
import { variants } from "../data/product.db";
import { packTypes } from "./pack.handler";

const BASE = "*/item/v1/OrderItem";

// The item's unit is its variant's packaging type (Box, Bag, Carton, …)
const unitOf = (variantId: string) => {
  const variant = variants.find((v) => v.id === variantId);
  const pack = packTypes.find((p) => p.id === variant?.packagingTypeId);
  return pack?.name ?? "-";
};

const toListItem = (item: MockOrderItem) => ({
  id: item.id,
  isDeleted: false,
  quantity: item.quantity,
  unitPrice: money(item.unitPrice),
  vat: money(item.vat),
  total: money(item.total),
  product: productName(item.variantId),
  unit: unitOf(item.variantId),
});

const toDetail = (item: MockOrderItem, order: MockOrder) => ({
  ...toListItem(item),
  dateAdd: order.orderDate,
  dateMod: null,
});

export const orderItemHandlers = [
  // id = order id
  http.get(`${BASE}/AllList/:id`, ({ params }) => {
    const order = orders.find((o) => o.id === params.id && !o.isDeleted);
    return order ? ok(order.items.map(toListItem)) : notFound("Order");
  }),

  // id = order item id
  http.get(`${BASE}/Detail/:id`, ({ params }) => {
    for (const order of orders) {
      if (order.isDeleted) continue;

      const item = order.items.find((i) => i.id === params.id);
      if (item) return ok(toDetail(item, order));
    }

    return notFound("Order item");
  }),
];
