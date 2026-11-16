import type { RawBaseDto } from "./baseDto.ts";

/* =========================
   Credit View
========================= */

export interface CreditViewDto {
  id: string;
  orderId: string;

  code: string;
  orderCode: string;
  status: string;

  total: string;
  paid: string;
  remain: string;
  dueDate: string;
  appDate: string;

  payPer: number;

  // Customer's reason for the credit request (set at checkout)
  remark: string;

  // Customer Info
  fullName: string;
  email: string;
  phoneNum: string;
  tin: string;
}

/* =========================
   Credit List
========================= */

export interface CreditListDto extends RawBaseDto {
  code: string;
  orderCode: string;
  customer: string;
  status: string;

  total: string;
  paid: string;
  remain: string;

  // Customer's reason for the credit request (set at checkout)
  remark: string;
}

/* =========================
   Credit Join
========================= */

export interface CreditJoin {
  id: string;
  isDeleted: boolean;

  code: string;
  orderCode: string;
  status: string;

  reqAmount: number;
  paid: number;
  remain: number;

  dueDate: string;
  appDate: string;

  customerId: string;
  orderId: string;
}
