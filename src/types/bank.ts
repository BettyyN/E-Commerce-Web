import type { BaseDto, RawBaseDto } from "./baseDto";
/* =========================
   Bank Map
========================= */
export interface BankMapDto {
  id: string;
  dateAdd: string;
  dateMod: string | null;
  isDeleted: boolean;
  name: string;
  acctNum: string;
  acctHolder: string;
  isActive: boolean;
  icon: string | null;
}

/* =========================
   Bank Detail
========================= */

export interface BankDetailDto extends BaseDto {
  name: string;
  acctNum: string;
  acctHolder: string;
  url: string;
  status: string;
}

/* =========================
   Bank List
========================= */

export interface BankListDto extends RawBaseDto {
  name: string;
  acctNum: string;
  acctHolder: string;
  url: string;
  status: string;
}

/* =========================
   Add Bank
========================= */

export interface BankAddDto {
  icon: File;
  name: string;
  acctNum: string;
  acctHolder: string;
}

/* =========================
   Modify Bank
========================= */

export interface BankModDto {
  id: string;
  name: string;
  acctNum: string;
  acctHolder: string;
  icon?: File | null;
}

/* =========================
   Add Request
========================= */

export interface BankAddReq {
  name: string;
  acctNum: string;
  acctHolder: string;
  icon: BnkIconUpload;
}

/* =========================
   Modify Request
========================= */

export interface BankModReq {
  id: string;
  name: string;
  acctNum: string;
  acctHolder: string;
  icon?: BnkIconUpload | null;
}

/* =========================
   Icon Upload
========================= */

export interface BnkIconUpload {
  content: File;
}

export interface BankIconList {
  id: string;
  url: string;
  name: string;
  acctNum: string;
  acctHolder: string;
}
