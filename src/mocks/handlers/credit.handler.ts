import { http, HttpResponse } from "msw";
import { customers, ok, notFound } from "../data/db";
import {
  credits,
  creditTotals,
  money,
  customerFromRequest,
  roleFromRequest,
  type MockCredit,
} from "../data/order.db";

const BASE = "*/item/v1/Credit";

const customerOf = (credit: MockCredit) =>
  customers.find((c) => c.id === credit.customerId);

const statusOf = (credit: MockCredit) =>
  creditTotals(credit).isPaid ? "Paid" : "Unpaid";

const toListItem = (credit: MockCredit) => {
  const { paid, remain } = creditTotals(credit);

  return {
    id: credit.id,
    isDeleted: credit.isDeleted,
    code: credit.code,
    orderCode: credit.orderCode,
    customer: customerOf(credit)?.fullName ?? "",
    status: statusOf(credit),
    total: money(credit.total),
    paid: money(paid),
    remain: money(remain),
    remark: credit.remark,
  };
};

const toView = (credit: MockCredit) => {
  const { paid, remain } = creditTotals(credit);
  const customer = customerOf(credit);

  return {
    id: credit.id,
    orderId: credit.orderId,
    code: credit.code,
    orderCode: credit.orderCode,
    status: statusOf(credit),
    total: money(credit.total),
    paid: money(paid),
    remain: money(remain),
    dueDate: credit.dueDate,
    appDate: credit.appDate,
    payPer:
      credit.total > 0 ? Math.round((paid / credit.total) * 10000) / 100 : 0,
    remark: credit.remark,
    fullName: customer?.fullName ?? "",
    email: customer?.email ?? "",
    phoneNum: customer?.phoneNum ?? "",
    tin: "0012345678", // placeholder: the customer mock has no TIN
  };
};

// The real API answers 204 when a list is empty, so the mock does too
const listResponse = (rows: ReturnType<typeof toListItem>[]) =>
  rows.length > 0 ? ok(rows) : new HttpResponse(null, { status: 204 });

// Customers only see their own credits; staff sees everything
const scopedCredits = (request: Request) => {
  const rows = credits.filter((c) => !c.isDeleted);
  if (roleFromRequest(request) === "cust") {
    const customerId = customerFromRequest(request).id;
    return rows.filter((c) => c.customerId === customerId);
  }
  return rows;
};

export const creditHandlers = [
  http.get(`${BASE}/Paid`, ({ request }) =>
    listResponse(
      scopedCredits(request)
        .filter((c) => creditTotals(c).isPaid)
        .map(toListItem),
    ),
  ),

  http.get(`${BASE}/Unpaid`, ({ request }) =>
    listResponse(
      scopedCredits(request)
        .filter((c) => !creditTotals(c).isPaid)
        .map(toListItem),
    ),
  ),

  http.get(`${BASE}/View/:id`, ({ request, params }) => {
    const credit = credits.find((c) => c.id === params.id && !c.isDeleted);
    if (
      credit &&
      roleFromRequest(request) === "cust" &&
      credit.customerId !== customerFromRequest(request).id
    ) {
      return notFound("Credit");
    }
    return credit ? ok(toView(credit)) : notFound("Credit");
  }),

  http.get(`${BASE}/ByOrder/:orderId`, ({ request, params }) => {
    const credit = credits.find(
      (c) => c.orderId === params.orderId && !c.isDeleted,
    );
    if (
      credit &&
      roleFromRequest(request) === "cust" &&
      credit.customerId !== customerFromRequest(request).id
    ) {
      return notFound("Credit");
    }
    return credit ? ok(toView(credit)) : notFound("Credit");
  }),
];
