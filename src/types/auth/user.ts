export interface CustUserListDto {
  isActive: boolean;
  hasAcct: boolean;
  customerId: string | null;
  id: string;
  fullName: string;
  email: string;
  phoneNum: string;
  status: string;
  hasAcctStr: string;
}

export interface EmpUserListDto {
  isActive: boolean;
  hasAcct: boolean;
  employeeId: string | null;
  id: string;
  fullName: string;
  email: string;
  status: string;
  hasAcctStr: string;
}

export interface PwdChgDto {
  oldPwd: string;
  newPwd: string;
}
