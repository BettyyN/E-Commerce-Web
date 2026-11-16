import type { BaseDto } from "./baseDto";

export interface EmployeeListDto extends BaseDto{
  fullName: string;
  email: string;
  role: string;
  status: string;
}

export interface EmployeeAddDto {
  fullName: string;
  email: string;
  password: string;
  roleId: string;
}

export interface EmployeeModDto {
  id: string;
  fullName: string;
  email: string;
}
