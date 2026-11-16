export interface MyCrdtListDto {
  id: string; // uuid
  isDeleted: boolean;
  code?: string | null;
  orderCode?: string | null;
  status?: string | null;
  total?: string | null;
  paid?: string | null;
  remain?: string | null;
}

export interface MyCrdtViewDto {
  id: string; // uuid
  orderId: string; // uuid
  code?: string | null;
  orderCode?: string | null;
  status?: string | null;
  total?: string | null;
  paid?: string | null;
  remain?: string | null;
  dueDate?: string | null;
  appDate?: string | null;
  payPer: number; 
}