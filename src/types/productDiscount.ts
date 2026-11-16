import type { BaseDto, RawBaseDto } from "./baseDto";

/* =========================
   Product Discount Detail
========================= */

export interface ProDiscntDetailDto extends BaseDto {
  type: string;
  valueStr: string;
  oldPriceStr: string;
  newPriceStr: string;
  status: string;
  startDateAt: string;
  endDateAt: string;
}

/* =========================
   Product Discount List
========================= */

export interface ProDiscntListDto extends RawBaseDto {
  type: string;
  variant: string;
  valueStr: string;
  oldPriceStr: string;
  newPriceStr: string;
  status: string;
  startDateAt: string;
  endDateAt: string;
}

/* =========================
   Variant Discount List
========================= */

export interface VarDiscntListDto extends RawBaseDto {
  type: string;
  valueStr: string;
  oldPriceStr: string;
  newPriceStr: string;
  status: string;
  startDateAt: string;
  endDateAt: string;
}

/* =========================
   Add Product Discount
========================= */

export interface ProDiscntAddDto {
  type: string;
  value: number;
  startDate: string;
  endDate: string;
  variantId: string;
}

/* =========================
   Modify Product Discount
========================= */

export interface ProDiscntModDto {
  id: string;
  type: string;
  value: number;
  startDate: string;
  endDate: string;
}

export interface VarDiscntAddDto {
  type: string;
  value: number;
  startDate: string;
  endDate: string;
  variantId: string;
}

export interface VarDiscntModDto {
  id: string;
  type: string;
  value: number;
  startDate: string;
  endDate: string;
}
