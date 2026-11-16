export interface OrderPayViewJoin {
  id: string;
  isDeleted: boolean;
  status: string;
  payMethod: string;
  payAmount: number;
  payDate: string;
  name: string;
}

export interface OrderPayViewDto {
  status: string;
  payMethod: string;
  payAmount: string;
  payDate: string;
  bank: string;
  id: string;
  isDeleted: boolean;
}

export interface CrdtPayJoin {
  id: string;
  isDeleted: boolean;
  payMethod: string;
  status: string;
  amount: number;
  payDate: string;
  appDate: string | null;
  name: string;
  code: string;
}

export interface CrdtPayPend {
  id: string;
  bank: string;
  amount: string;
  payDate: string;
  payMethod: string;
  status: string;
}

export interface CrdtPayListDto {
  id: string;
  isDeleted: boolean;
  code: string;
  bank: string;
  amount: string;
  payDate: string;
  appDate: string;
  payMethod: string;
  status: string;
}
