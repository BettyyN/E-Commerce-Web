export interface MyOrdListDto {
  id: string; // uuid
  isDeleted: boolean;
  code?: string | null; 
  status?: string | null;
  amount?: string | null;
  hasShipping?: string | null; 
  isCreditStr?: string | null; 
  orderAt?: string | null; 
}

export interface MyOrdViewDto {
  id: string; // uuid
  code?: string | null;
  status?: string | null;
  hasShipping?: string | null;
  isCredit: boolean;
  isCreditStr?: string | null;
  orderDateAt?: string | null;
  total?: string | null;
  subTotal?: string | null;
  vat?: string | null;
}