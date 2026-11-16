import type { RawBaseDto } from "./baseDto";

/* =========================
   Product Image List
========================= */

export interface ProImageListDto extends RawBaseDto {
  fileName: string;
  contentType: string;
  size: string;
  url: string;
  isMainStr: string;
}

/* =========================
   Add Product Image
========================= */

export interface ProImageAddDto {
  productId: string;
  isMain: boolean;
  image: File;
}

/* =========================
   Add Product Image Request
========================= */

export interface ProImageAddReq {
  productId: string;
  isMain: boolean;
  image: ImageAddDto;
}

/* =========================
   Image Upload
========================= */

export interface ImageAddDto {
  fileName: string;
  contentType: string;
  length: number;
  content: File;
}
