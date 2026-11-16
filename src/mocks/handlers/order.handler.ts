import { http, HttpResponse } from "msw";
import type { OrderRvwDto } from "@/types/order";
import type { StatChangeDto } from "@/types/dto";
import { customers, ok, problem, notFound } from "../data/db";
import {
  orders,
  credits,
  creditPayments,
  money,
  setTerms,
  customerFromRequest,
  roleFromRequest,
  type MockOrder,
} from "../data/order.db";

const BASE = "*/item/v1/Order";

const customerOf = (o: MockOrder) =>
  customers.find((c) => c.id === o.customerId);

const toListItem = (o: MockOrder) => ({
  id: o.id,
  isDeleted: o.isDeleted,
  code: o.code,
  status: o.status,
  customer: customerOf(o)?.fullName ?? "",
  amount: money(o.total),
  hasShipping: o.hasShipping ? "Yes" : "No",
  isCreditStr: o.isCredit ? "Credit" : "Paid",
  orderDateAt: o.orderDate,
});

const toView = (o: MockOrder) => {
  const customer = customerOf(o);

  return {
    id: o.id,
    code: o.code,
    status: o.status,
    hasShipping: o.hasShipping ? "Yes" : "No",
    isCredit: o.isCredit,
    isCreditStr: o.isCredit ? "Credit" : "Paid",
    orderDateAt: o.orderDate,
    fullName: customer?.fullName ?? "",
    email: customer?.email ?? "",
    phoneNum: customer?.phoneNum ?? "",
    tin: "0012345678", // placeholder: the customer mock has no TIN
    total: money(o.total),
    subTotal: money(o.subTotal),
    vat: money(o.vat),
  };
};

const findOrder = (id: string) =>
  orders.find((o) => o.id === id && !o.isDeleted);
const creditOf = (order: MockOrder) =>
  credits.find((c) => c.orderId === order.id);

const byNewest = (a: MockOrder, b: MockOrder) =>
  b.orderDate.localeCompare(a.orderDate);

// Customers only ever see their own orders; staff sees everything
const scopedOrders = (request: Request) => {
  const rows = orders.filter((o) => !o.isDeleted);
  if (roleFromRequest(request) === "cust") {
    const customerId = customerFromRequest(request).id;
    return rows.filter((o) => o.customerId === customerId);
  }
  return rows;
};

// The real API answers 204 when a list is empty
const listResponse = (rows: MockOrder[]) =>
  rows.length > 0
    ? ok(rows.sort(byNewest).map(toListItem))
    : new HttpResponse(null, { status: 204 });

export const orderHandlers = [
  http.get(`${BASE}/AllList`, ({ request }) =>
    listResponse(scopedOrders(request)),
  ),

  // Orders waiting for a decision (paid: verify, credit: review)
  http.get(`${BASE}/Pend`, ({ request }) =>
    listResponse(
      scopedOrders(request).filter((o) => o.status === "Pending"),
    ),
  ),

  http.get(`${BASE}/View/:id`, ({ request, params }) => {
    const order = findOrder(String(params.id));
    if (
      order &&
      roleFromRequest(request) === "cust" &&
      order.customerId !== customerFromRequest(request).id
    ) {
      return notFound("Order"); // hide other customers' orders
    }
    return order ? ok(toView(order)) : notFound("Order");
  }),

  // Paid orders only. stat: true = payment confirmed, false = rejected
  http.post(`${BASE}/VerifyOrder`, async ({ request }) => {
    const { id, stat } = (await request.json()) as StatChangeDto;

    const order = findOrder(id);
    if (!order) return notFound("Order");

    if (order.isCredit) {
      return problem(
        400,
        "Verify failed",
        "Credit orders are reviewed, not verified.",
      );
    }
    if (order.status !== "Pending") {
      return problem(
        400,
        "Verify failed",
        "This order has already been processed.",
      );
    }

    order.status = stat ? "Verified" : "Rejected";
    return ok(null, 201);
  }),

  // Credit orders only. stat: true = approve with `days` to pay, false = reject
  http.post(`${BASE}/ReviewCrdt`, async ({ request }) => {
    const { id, stat, days } = (await request.json()) as OrderRvwDto;

    const order = findOrder(id);
    if (!order) return notFound("Order");

    if (!order.isCredit) {
      return problem(
        400,
        "Review failed",
        "Only credit orders can be reviewed.",
      );
    }
    if (order.status !== "Pending") {
      return problem(
        400,
        "Review failed",
        "This order has already been reviewed.",
      );
    }

    const credit = creditOf(order);

    if (stat) {
      if (!Number.isFinite(days) || days <= 0) {
        return problem(
          400,
          "Review failed",
          "Days to pay must be greater than zero.",
        );
      }
      order.status = "Approved";
      if (credit) setTerms(credit, days);
    } else {
      order.status = "Rejected";
      if (credit) credit.isDeleted = true; // a rejected credit disappears from the lists
    }

    return ok(null, 201);
  }),

  http.delete(`${BASE}/Del/:id`, ({ params }) => {
    const order = findOrder(String(params.id));
    if (!order) return notFound("Order");

    const credit = creditOf(order);
    if (
      credit &&
      creditPayments.some(
        (p) => p.creditId === credit.id && p.status === "Approved",
      )
    ) {
      return problem(
        400,
        "Delete failed",
        "Orders with approved credit payments cannot be deleted.",
      );
    }

    order.isDeleted = true; // soft delete
    if (credit) credit.isDeleted = true;
    return ok();
  }),
];
