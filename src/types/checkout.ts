export interface CheckoutPayDto {
  bankId: string;
  payMethod: string;
  receipt: File;
  items: OrderItemsAdd[];
}

export interface CheckoutCreditDto {
  remark: string;
  items: OrderItemsAdd[];
}

export interface OrderItemsAdd {
  variantId: string;
  quantity: number;
}

export interface CheckoutPayReq {
  customerId: string;
  bankId: string;
  payMethod: string;
  receipt: ReceiptUpload;
  items: OrderItemsAdd[];
}

export interface CheckoutCreditReq {
  customerId: string;
  remark: string;
  items: OrderItemsAdd[];
}

export interface ReceiptUpload {
  contentType: string;
  length: number;
  content: File;
}

export interface ItemPrice {
  variantId: string;
  quantity: number;
  unitPrice: number;
  vat: number;
  total: number;
}

export interface OrderPricingResult {
  items: ItemPrice[];
  subTotal: number;
  vat: number;
  total: number;
}

export interface ProStockInfo {
  variantId: string;
  name: string;
  quantity: number;
  isDeleted: boolean;
}
