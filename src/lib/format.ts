/* Shared formatting + status helpers for the real API DTOs.
   Amounts arrive as formatted strings ("2,300.00"), dates as ISO strings. */

import type { CustomerListDto } from "@/types/customer";

export const parseMoney = (value: string | null | undefined): number => {
  if (!value) return 0;
  const n = parseFloat(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export const fmtDate = (value: string | null | undefined): string => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

/* ---------- customer status ---------- */

export const isActiveCustomer = (c: CustomerListDto) =>
  // c.isActive ?? c.isActiveStr === "Active";
  c.status === "Active";

export const customerStatusLabel = (c: CustomerListDto) =>
  isActiveCustomer(c) ? "Active" : "In-active";

/* ---------- status badge colors ---------- */

// Order status: Pending | Verified | Approved | Rejected
export const getOrderStatusColor = (status: string | null | undefined) => {
  switch (status) {
    case "Verified":
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

// Credit status: Paid | Unpaid
export const getCreditStatusColor = (status: string | null | undefined) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-800";
    case "Unpaid":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

// Payment status shown on order pages: Paid | Pending | Unpaid | Rejected | Credit
export const getPaymentStatusColor = (status: string | null | undefined) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-800";
    case "Credit":
      return "bg-blue-100 text-blue-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Unpaid":
    case "Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

// Credit payment status: Approved | Pending | Rejected
export const getCrdtPayStatusColor = (status: string | null | undefined) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};
