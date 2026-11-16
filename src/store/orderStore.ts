import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PaymentStatus = "pending" | "verified" | "rejected";
export type CreditStatus = "pending" | "approved" | "paid" | "overdue";
export type OrderStatus =
  | "pending"
  | "payment_verified"
  | "processing"
  | "completed"
  | "rejected";

export interface OrderItem {
  name: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customer: string;
  customerPhone: string;
  customerEmail: string;
  items: number;
  amount: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  date: string;
  products: string[];
  orderItems: OrderItem[];
  bank?: string;
  receiptUrl?: string;
  receiptFileName?: string;
  paymentMethod?: "payment" | "credit";
  storekeeperId?: string;
}

export interface CreditOrder {
  id: string;
  customer: string;
  customerPhone: string;
  customerEmail: string;
  items: number;
  amount: string;
  creditStatus: CreditStatus;
  orderStatus: OrderStatus;
  date: string;
  dueDate: string;
  orderItems: OrderItem[];
  notes?: string;
}

interface OrderStore {
  orders: Order[];
  creditOrders: CreditOrder[];
  verifyPayment: (id: string) => void;
  rejectPayment: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateCreditStatus: (id: string, status: CreditStatus) => void;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: "#1234",
    customer: "Abebe Kebede",
    customerPhone: "+251 911 111 001",
    customerEmail: "abebe@gmail.com",
    items: 3,
    amount: "2,500 ETB",
    orderStatus: "payment_verified",
    paymentStatus: "verified",
    date: "2024-03-06",
    products: ["Premium Suit", "Dress Shirt", "Tie"],
    orderItems: [
      { name: "Premium Suit", qty: 1, unitPrice: 1800 },
      { name: "Dress Shirt", qty: 1, unitPrice: 500 },
      { name: "Tie", qty: 1, unitPrice: 200 },
    ],
    bank: "Commercial Bank of Ethiopia",
    receiptFileName: "receipt_1234.jpg",
    paymentMethod: "payment",
  },
  {
    id: "#1235",
    customer: "Tigist Alemu",
    customerPhone: "+251 911 222 002",
    customerEmail: "tigist@gmail.com",
    items: 2,
    amount: "1,800 ETB",
    orderStatus: "pending",
    paymentStatus: "pending",
    date: "2024-03-06",
    products: ["Evening Dress", "Handbag"],
    orderItems: [
      { name: "Evening Dress", qty: 1, unitPrice: 1200 },
      { name: "Handbag", qty: 1, unitPrice: 600 },
    ],
    bank: "Dashen Bank",
    receiptFileName: "receipt_1235.png",
    paymentMethod: "payment",
  },
  {
    id: "#1236",
    customer: "Dawit Tesfaye",
    customerPhone: "+251 911 333 003",
    customerEmail: "dawit@gmail.com",
    items: 5,
    amount: "3,200 ETB",
    orderStatus: "pending",
    paymentStatus: "pending",
    date: "2024-03-05",
    products: ["Business Suit", "Shoes", "Belt", "Watch", "Cufflinks"],
    orderItems: [
      { name: "Business Suit", qty: 1, unitPrice: 1500 },
      { name: "Shoes", qty: 1, unitPrice: 800 },
      { name: "Belt", qty: 1, unitPrice: 300 },
      { name: "Watch", qty: 1, unitPrice: 450 },
      { name: "Cufflinks", qty: 1, unitPrice: 150 },
    ],
    bank: "Awash Bank",
    receiptFileName: "receipt_1236.pdf",
    paymentMethod: "payment",
  },
  {
    id: "#1237",
    customer: "Sara Bekele",
    customerPhone: "+251 911 444 004",
    customerEmail: "sara@gmail.com",
    items: 1,
    amount: "950 ETB",
    orderStatus: "completed",
    paymentStatus: "verified",
    date: "2024-03-05",
    products: ["Casual Dress"],
    orderItems: [{ name: "Casual Dress", qty: 1, unitPrice: 950 }],
    bank: "Bunna International Bank",
    receiptFileName: "receipt_1237.jpg",
    paymentMethod: "payment",
  },
  {
    id: "#1238",
    customer: "Yohannes Tadesse",
    customerPhone: "+251 911 555 005",
    customerEmail: "yohannes@gmail.com",
    items: 4,
    amount: "2,100 ETB",
    orderStatus: "pending",
    paymentStatus: "pending",
    date: "2024-03-04",
    products: ["Blazer", "Trousers", "Shirt", "Accessories"],
    orderItems: [
      { name: "Blazer", qty: 1, unitPrice: 900 },
      { name: "Trousers", qty: 1, unitPrice: 600 },
      { name: "Shirt", qty: 1, unitPrice: 400 },
      { name: "Accessories", qty: 1, unitPrice: 200 },
    ],
    bank: "Zemen Bank",
    receiptFileName: "receipt_1238.png",
    paymentMethod: "payment",
  },
  {
    id: "#1239",
    customer: "Mulugeta Assefa",
    customerPhone: "+251 911 666 006",
    customerEmail: "mulugeta@gmail.com",
    items: 2,
    amount: "1,500 ETB",
    orderStatus: "payment_verified",
    paymentStatus: "verified",
    date: "2024-03-04",
    products: ["Polo Shirt", "Chinos"],
    orderItems: [
      { name: "Polo Shirt", qty: 2, unitPrice: 400 },
      { name: "Chinos", qty: 1, unitPrice: 700 },
    ],
    bank: "Wegagen Bank",
    receiptFileName: "receipt_1239.jpg",
    paymentMethod: "payment",
  },
  {
    id: "#1240",
    customer: "Hanna Girma",
    customerPhone: "+251 911 777 007",
    customerEmail: "hanna@gmail.com",
    items: 3,
    amount: "2,200 ETB",
    orderStatus: "pending",
    paymentStatus: "pending",
    date: "2024-03-03",
    products: ["Formal Dress", "Heels", "Jewelry"],
    orderItems: [
      { name: "Formal Dress", qty: 1, unitPrice: 1200 },
      { name: "Heels", qty: 1, unitPrice: 700 },
      { name: "Jewelry", qty: 1, unitPrice: 300 },
    ],
    bank: "Berhan Bank",
    receiptFileName: "receipt_1240.jpg",
    paymentMethod: "payment",
  },
  {
    id: "#1241",
    customer: "Yared Mekonnen",
    customerPhone: "+251 911 888 008",
    customerEmail: "yared@gmail.com",
    items: 6,
    amount: "4,100 ETB",
    orderStatus: "completed",
    paymentStatus: "verified",
    date: "2024-03-03",
    products: [
      "Tuxedo",
      "Dress Shirt",
      "Bow Tie",
      "Cummerbund",
      "Shoes",
      "Cufflinks",
    ],
    orderItems: [
      { name: "Tuxedo", qty: 1, unitPrice: 2000 },
      { name: "Dress Shirt", qty: 1, unitPrice: 500 },
      { name: "Bow Tie", qty: 1, unitPrice: 200 },
      { name: "Cummerbund", qty: 1, unitPrice: 250 },
      { name: "Shoes", qty: 1, unitPrice: 800 },
      { name: "Cufflinks", qty: 1, unitPrice: 350 },
    ],
    bank: "Bank of Abyssinia",
    receiptFileName: "receipt_1241.pdf",
    paymentMethod: "payment",
  },
];

const INITIAL_CREDIT_ORDERS: CreditOrder[] = [
  {
    id: "#C001",
    customer: "Bekele Haile",
    customerPhone: "+251 911 001 001",
    customerEmail: "bekele@gmail.com",
    items: 3,
    amount: "6,800 ETB",
    creditStatus: "pending",
    orderStatus: "processing",
    date: "2024-03-06",
    dueDate: "2024-04-06",
    orderItems: [
      { name: "Formal Suit", qty: 1, unitPrice: 4500 },
      { name: "Dress Shirt", qty: 1, unitPrice: 1500 },
      { name: "Tie", qty: 1, unitPrice: 800 },
    ],
    notes: "Customer requested 30-day credit payment.",
  },
  {
    id: "#C002",
    customer: "Lemlem Tadesse",
    customerPhone: "+251 911 002 002",
    customerEmail: "lemlem@gmail.com",
    items: 2,
    amount: "3,200 ETB",
    creditStatus: "approved",
    orderStatus: "payment_verified",
    date: "2024-03-04",
    dueDate: "2024-04-04",
    orderItems: [
      { name: "Evening Gown", qty: 1, unitPrice: 2500 },
      { name: "Accessories Set", qty: 1, unitPrice: 700 },
    ],
  },
  {
    id: "#C003",
    customer: "Solomon Girma",
    customerPhone: "+251 911 003 003",
    customerEmail: "solomon@gmail.com",
    items: 4,
    amount: "9,100 ETB",
    creditStatus: "overdue",
    orderStatus: "completed",
    date: "2024-02-10",
    dueDate: "2024-03-10",
    orderItems: [
      { name: "Business Suit", qty: 1, unitPrice: 5000 },
      { name: "Shoes", qty: 1, unitPrice: 2000 },
      { name: "Belt", qty: 1, unitPrice: 600 },
      { name: "Briefcase", qty: 1, unitPrice: 1500 },
    ],
    notes: "Payment due date passed. Follow-up required.",
  },
  {
    id: "#C004",
    customer: "Mekdes Alemu",
    customerPhone: "+251 911 004 004",
    customerEmail: "mekdes@gmail.com",
    items: 2,
    amount: "4,400 ETB",
    creditStatus: "paid",
    orderStatus: "completed",
    date: "2024-02-20",
    dueDate: "2024-03-20",
    orderItems: [
      { name: "Traditional Dress", qty: 1, unitPrice: 3500 },
      { name: "Jewelry Set", qty: 1, unitPrice: 900 },
    ],
  },
  {
    id: "#C005",
    customer: "Tesfaye Worku",
    customerPhone: "+251 911 005 005",
    customerEmail: "tesfaye@gmail.com",
    items: 3,
    amount: "7,500 ETB",
    creditStatus: "pending",
    orderStatus: "pending",
    date: "2024-03-07",
    dueDate: "2024-04-07",
    orderItems: [
      { name: "Winter Coat", qty: 1, unitPrice: 4500 },
      { name: "Scarf", qty: 2, unitPrice: 750 },
      { name: "Gloves", qty: 1, unitPrice: 500 },
    ],
  },
];

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: INITIAL_ORDERS,
      creditOrders: INITIAL_CREDIT_ORDERS,

      verifyPayment: (id) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  paymentStatus: "verified",
                  orderStatus: "payment_verified",
                }
              : o,
          ),
        })),

      rejectPayment: (id) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id
              ? { ...o, paymentStatus: "rejected", orderStatus: "rejected" }
              : o,
          ),
        })),

      updateOrderStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, orderStatus: status } : o,
          ),
        })),

      updateCreditStatus: (id, status) =>
        set((s) => ({
          creditOrders: s.creditOrders.map((o) =>
            o.id === id ? { ...o, creditStatus: status } : o,
          ),
        })),
    }),
    { name: "order-storage-v3" },
  ),
);
