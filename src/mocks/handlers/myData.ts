import { http, HttpResponse } from "msw";
import { ok, notFound } from "../data/db";
import {
  orders,
  credits,
  creditTotals,
  money,
  customerFromRequest,
} from "../data/order.db";
import type { MyOrdListDto, MyOrdViewDto } from "@/types/myOrder";
import type { MyCrdtListDto, MyCrdtViewDto } from "@/types/myCredit";

const BASE = "*/item/v1/MyData";

/* The "MyData" endpoints serve the signed-in customer's own orders/credits.
   They read the SAME records as the admin Credit/Order lists, so every id
   here matches the ids used by OrderItem/AllList, Pay/*, CrdtPay/* etc. */

const toOrderList = (o: (typeof orders)[number]): MyOrdListDto => ({
  id: o.id,
  isDeleted: o.isDeleted,
  code: o.code,
  status: o.status,
  amount: money(o.total),
  hasShipping: o.hasShipping ? "Yes" : "No",
  isCreditStr: o.isCredit ? "Yes" : "No",
  orderAt: o.orderDate,
});

const toOrderView = (o: (typeof orders)[number]): MyOrdViewDto => ({
  id: o.id,
  code: o.code,
  status: o.status,
  hasShipping: o.hasShipping ? "Yes" : "No",
  isCredit: o.isCredit,
  isCreditStr: o.isCredit ? "Yes" : "No",
  orderDateAt: o.orderDate,
  total: money(o.total),
  subTotal: money(o.subTotal),
  vat: money(o.vat),
});

const creditStatus = (c: (typeof credits)[number]) =>
  creditTotals(c).isPaid ? "Paid" : "Unpaid";

const toCreditList = (c: (typeof credits)[number]): MyCrdtListDto => {
  const { paid, remain } = creditTotals(c);

  return {
    id: c.id,
    isDeleted: c.isDeleted,
    code: c.code,
    orderCode: c.orderCode,
    status: creditStatus(c),
    total: money(c.total),
    paid: money(paid),
    remain: money(remain),
  };
};

const toCreditView = (c: (typeof credits)[number]): MyCrdtViewDto => {
  const { paid, remain } = creditTotals(c);

  return {
    id: c.id,
    orderId: c.orderId,
    code: c.code,
    orderCode: c.orderCode,
    status: creditStatus(c),
    total: money(c.total),
    paid: money(paid),
    remain: money(remain),
    dueDate: c.dueDate,
    appDate: c.appDate,
    payPer: c.total > 0 ? Math.round((paid / c.total) * 10000) / 100 : 0,
  };
};

export const myDataHandlers = [
  http.get(`${BASE}/OrderAll`, ({ request }) => {
    const me = customerFromRequest(request).id;
    const rows = orders
      .filter((o) => !o.isDeleted && o.customerId === me)
      .map(toOrderList);

    // The real API answers 204 on an empty list, like the other endpoints
    return rows.length > 0 ? ok(rows) : new HttpResponse(null, { status: 204 });
  }),

  http.get(`${BASE}/OrderView/:id`, ({ request, params }) => {
    const me = customerFromRequest(request).id;
    const order = orders.find(
      (o) => o.id === params.id && !o.isDeleted && o.customerId === me,
    );

    return order ? ok(toOrderView(order)) : notFound("Order");
  }),

  http.get(`${BASE}/CreditAll`, ({ request }) => {
    const me = customerFromRequest(request).id;
    const rows = credits
      .filter((c) => !c.isDeleted && c.customerId === me)
      .map(toCreditList);

    // The real API answers 204 on an empty list, like the other endpoints
    return rows.length > 0 ? ok(rows) : new HttpResponse(null, { status: 204 });
  }),

  http.get(`${BASE}/CreditView/:id`, ({ request, params }) => {
    const me = customerFromRequest(request).id;
    const credit = credits.find(
      (c) => c.id === params.id && !c.isDeleted && c.customerId === me,
    );

    return credit ? ok(toCreditView(credit)) : notFound("Credit");
  }),
];