export interface CustReg {
  fullName: string;
  email: string;
  phoneNum: string;
  tin: string;
  password: string;
}

export interface AccountRegDto {
  id: string;
  roleId: string;
  email: string;
  password: string;
  isActive: boolean;
}

export interface RegRes {
  userId: string;
}
