import type { Base } from "./baseDto";


export interface CustomerList extends Base {
  fullName: string;
  email: string;
  phoneNum: string;
  tin: string;
  status: string;
}

export interface CustomerAdd {
  fullName: string;
  email: string;
  phoneNum: string;
  tin: string;
  password: string;
}

export interface CustomerMod {
  id: string;
  fullName: string;
  email: string;
  phoneNum: string;
  tin: string;
}
