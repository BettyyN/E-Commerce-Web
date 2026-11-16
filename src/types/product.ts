import type { BaseDto, RawBaseDto } from "./baseDto";

/* =========================
   Product Dashboard
========================= */

export interface ProDashBoard extends BaseDto {
  name: string;
  category: string;
  desc: string;
  shortDesc: string;
  brand: string;
  originCountry: string;
  ingredients: string;
  storageInst: string;
  isPerishableStr: string;
  status: string;
}

/* =========================
   Product List
========================= */

export interface ProListDto extends RawBaseDto {
  name: string;
  category: string;
  isPerishableStr: string;
  status: string;
}

/* =========================
   Add Product
========================= */

export interface ProAddDto {
  name: string;
  isPerishable: boolean;
  categoryId: string;

  // Product Detail
  desc: string;
  shortDesc: string;
  brand: string;
  originCountry: string;
  ingredients: string;
  storageInst: string;
}

/* =========================
   Modify Product
========================= */

export interface ProModDto {
  id: string;
  name: string;
  isPerishable: boolean;
  categoryId: string;

  // Product Detail
  desc: string;
  shortDesc: string;
  brand: string;
  originCountry: string;
  ingredients: string;
  storageInst: string;
}