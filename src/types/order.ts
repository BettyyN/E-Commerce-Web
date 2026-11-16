import type { RawBaseDto } from "./baseDto";

/* =========================
   Order View Join
========================= */

export interface OrderViewJoin {
  id: string;
  code: string;
  status: string;
  total: number;
  subTotal: number;
  vat: number;
  shipping: boolean;
  orderDate: string;
  isCredit: boolean;
  customerId: string;
}

/* =========================
   Order View
========================= */

export interface OrderViewDto {
  id: string;
  code: string;
  status: string;
  hasShipping: string;
  isCredit: boolean;
  isCreditStr: string;
  orderDateAt: string;

  // Customer Info
  fullName: string;
  email: string;
  phoneNum: string;
  tin: string;

  // Payment Details
  total: string;
  subTotal: string;
  vat: string;
}

/* =========================
   Order List
========================= */

export interface OrderListDto extends RawBaseDto {
  code: string;
  status: string;
  customer: string;
  amount: string;
  hasShipping: string;
  isCreditStr: string;
  orderDateAt: string;
}

/* =========================
   Order Review
========================= */

export interface OrderRvwDto {
  id: string;
  stat: boolean;
  days: number;
}
