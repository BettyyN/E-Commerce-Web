import { http, HttpResponse } from "msw";
import { ok, notFound } from "../data/db";
import { dataUriResponse } from "../data/file.utils";
import { orders, credits, creditPayments, money } from "../data/order.db";
import { banks } from "./bank.handler";

const BASE = "*/item/v1/Pay";

const bankName = (id: string) => banks.find((b) => b.id === id)?.name ?? "";

const noContent = () => new HttpResponse(null, { status: 204 });

export const payHandlers = [
  // id = order id. The mock uses the order id as the payment id too.
  http.get(`${BASE}/Order/:id`, ({ params }) => {
    const order = orders.find((o) => o.id === params.id && !o.isDeleted);
    if (!order) return notFound("Order");
    if (!order.payment) return noContent(); // credit orders have no upfront payment

    return ok({
      id: order.id,
      isDeleted: order.isDeleted,
      status: order.status,
      payMethod: order.payment.payMethod,
      payAmount: money(order.payment.amount),
      payDate: order.payment.payDate,
      bank: bankName(order.payment.bankId),
    });
  }),

  http.get(`${BASE}/OrderReceipt/:id`, async ({ params }) => {
    const order = orders.find((o) => o.id === params.id && !o.isDeleted);
    if (!order?.payment) return notFound("Receipt");

    return dataUriResponse(order.payment.receipt);
  }),

  // id = credit id: all payments
  http.get(`${BASE}/Credit/:id`, ({ params }) => {
    if (!credits.some((c) => c.id === params.id && !c.isDeleted))
      return notFound("Credit");

    const rows = creditPayments
      .filter((p) => p.creditId === params.id)
      .map((p) => ({
        id: p.id,
        isDeleted: false,
        code: p.code,
        bank: bankName(p.bankId),
        amount: money(p.amount),
        payDate: p.payDate,
        appDate: p.reviewedAt ?? "",
        payMethod: p.payMethod,
        status: p.status,
      }));

    return rows.length > 0 ? ok(rows) : noContent();
  }),

  // id = credit id: only payments waiting for review
  http.get(`${BASE}/CreditPend/:id`, ({ params }) => {
    if (!credits.some((c) => c.id === params.id && !c.isDeleted))
      return notFound("Credit");

    // Only one pending payment can exist per credit — return a single object
    const pending = creditPayments
      .filter((p) => p.creditId === params.id && p.status === "Pending")
      .map((p) => ({
        id: p.id,
        bank: bankName(p.bankId),
        amount: money(p.amount),
        payDate: p.payDate,
        payMethod: p.payMethod,
        status: p.status,
      }))[0];

    return pending ? ok(pending) : noContent();
  }),

  // id = credit payment id
  http.get(`${BASE}/CreditReceipt/:id`, async ({ params }) => {
    const payment = creditPayments.find((p) => p.id === params.id);
    return payment ? dataUriResponse(payment.receipt) : notFound("Receipt");
  }),
];
