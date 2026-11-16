import type { BaseDto, RawBaseDto } from "./baseDto";

/* =========================
   Measurement Type Detail
========================= */

export interface MeasTypeDetailDto extends BaseDto {
  code: string;
  name: string;
  status: string;
}

/* =========================
   Measurement Type List
========================= */

export interface MeasTypeListDto extends RawBaseDto {
  code: string;
  name: string;
  status: string;
}

/* =========================
   Add Measurement Type
========================= */

export interface MeasTypeAddDto {
  code: string;
  name: string;
}

/* =========================
   Modify Measurement Type
========================= */

export interface MeasTypeModDto {
  id: string;
  code: string;
  name: string;
}
