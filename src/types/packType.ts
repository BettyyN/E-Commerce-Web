import type { BaseDto, RawBaseDto } from "./baseDto";

/* =========================
   Pack Type Detail
========================= */

export interface PackTypeDetailDto extends BaseDto {
  code: string;
  name: string;
  desc: string;
  status: string;
}

/* =========================
   Pack Type List
========================= */

export interface PackTypeListDto extends RawBaseDto {
  code: string;
  name: string;
  status: string;
}

/* =========================
   Add Pack Type
========================= */

export interface PackTypeAddDto {
  code: string;
  name: string;
}

/* =========================
   Modify Pack Type
========================= */

export interface PackTypeModDto {
  id: string;
  code: string;
  name: string;
}
