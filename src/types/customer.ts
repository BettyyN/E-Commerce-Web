import type { BaseDto } from "./baseDto";

export interface CustomerListDto extends BaseDto {         
  fullName: string;
  email: string;
  phoneNum: string;
  tin: string;
  status: string;
}

export interface CustomerAddDto {
  fullName: string;
  email?: string;
  phoneNum: string;
  tin?:string;
  password: string;
}

export interface CustomerModDto {
  id: string;
  fullName: string;
  email?: string;
  phoneNum: string;
  tin?:string;
}
