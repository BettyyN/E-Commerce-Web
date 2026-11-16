export const CreditStatus = {
  "0": "Unpaid",
  "1": "Paid",
} as const;

export type CreditStatus = (typeof CreditStatus)[keyof typeof CreditStatus];

// export const DiscountType = {
//   "0": "Percentage",
//   "1": "Fixed Amount",
// } as const;

// export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

export const OrderStatus = {
  "0": "Pending",
  "1": "Approved",
  "2": "Delivered",
  "3": "Completed",
  "4": "Rejected",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PayMethod = {
  "0": "Bank Transfer",
  "1": "Cheque",
} as const;

export type PayMethod = (typeof PayMethod)[keyof typeof PayMethod];

export const PayStatus = {
  "0": "Pending",
  "1": "Approved",
  "2": "Rejected",
} as const;

export type PayStatus = (typeof PayStatus)[keyof typeof PayStatus];

export const DiscountTypes = {
  "0": "Percentage",
  "1": "Fixed",
} as const;

export type DiscountType = (typeof DiscountTypes)[keyof typeof DiscountTypes];