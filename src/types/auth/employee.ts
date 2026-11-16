import type { Base } from "./baseDto";

export interface EmployeeList extends Base {
  fullName: string;
  email: string;
  role: string;
  status: string;
}

export interface EmployeeAdd {
  fullName: string;
  email: string;
  password: string;
  roleId: string;
}

export interface EmployeeMod {
  id: string;
  fullName: string;
  email: string;
}
