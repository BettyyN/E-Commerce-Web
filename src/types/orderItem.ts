import type { BaseDto, RawBaseDto } from "./baseDto";

export interface OrderItemJoin {
  unitPrice: number;
  vat: number;
  total: number;
  prName: string;
  name: string;
  code: string;
  quantity: number;
  id: string;
  dateAdd: string;
  dateMod?: string | null;
  isDeleted: boolean;
}

export interface OrderItemDetailDto extends BaseDto {
  quantity: number;
  unitPrice: string;
  vat: string;
  total: string;
  product: string;
  unit?: string; // packaging type of the item's variant (Box, Bag, Carton, …)
}

export interface OrderItemListDto extends RawBaseDto {
  quantity: number;
  unitPrice: string;
  vat: string;
  total: string;
  product: string;
  unit?: string; // packaging type of the item's variant (Box, Bag, Carton, …)
}
