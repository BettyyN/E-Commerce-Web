import type { BaseDto, RawBaseDto } from "./baseDto.ts";

/* =========================
   Category Detail
========================= */

export interface CatDetailDto extends BaseDto {
  name: string;
  icon: string;
  status: string;
}

/* =========================
   Category List
========================= */

export interface CatListDto extends RawBaseDto {
  name: string;
  icon: string;
  status: string;
}

/* =========================
   Add Category
========================= */

export interface CatAddDto {
  name: string;
  icon: string;
}

/* =========================
   Modify Category
========================= */

export interface CatModDto {
  id: string;
  name: string;
  icon: string;
}