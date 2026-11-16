import type { BaseDto, RawBaseDto } from "./baseDto";

/* =========================
   Product Variant Detail
========================= */

export interface ProVarDetailDto extends BaseDto {
  sortOrder: number;
  itemPkg: string;
  name: string;
  batchNumber: string;
  qtyStr: number;

  priceStr: string;
  vatStr: string;
  totPrice: string;

  measType: string;
  packagingType: string;
  isDefaultStr: string;
  status: string;

  manufactureAt: string;
  expireAt: string;
}

/* =========================
   Product Variant List
========================= */

export interface ProVarListDto extends RawBaseDto {
  sortOrder: number;
  itemPkg: string;
  name: string;
  totPrice: string;
  qtyStr: number;
  measType: string;
  packagingType: string;
  isDefaultStr: string;
  status: string;
}

/* =========================
   Add Product Variant
========================= */

export interface ProVarAddDto {
  sortOrder: number;
  itemPkg: string;
  name: string;
  totalPrice: number;
  batchNumber: string;
  manufactureDate: string | null;
  expireDate: string | null;
  isDefault: boolean;
  quantity: number;
  packagingTypeId: string;
  measTypeId: string;
  productId: string;
}

/* =========================
   Modify Product Variant
========================= */

export interface ProVarModDto {
  id: string;
  sortOrder: number;
  itemPkg: string;
  name: string;
  batchNumber: string;
  manufactureDate: string | null;
  expireDate: string | null;
  packagingTypeId: string;
  measTypeId: string;
}

/* =========================
   Variant Price
========================= */

export interface ProVarPriceDto {
  id: string;
  totalPrice: number;
}

/* =========================
   Variant Quantity
========================= */

export interface ProVarQtyDto {
  id: string;
  quantity: number;
}
