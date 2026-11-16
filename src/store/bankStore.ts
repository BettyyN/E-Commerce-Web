import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  logo?: string; // base64 or url
  isActive: boolean;
  createdAt: string;
}

interface BankStore {
  banks: BankAccount[];
  addBank: (bank: Omit<BankAccount, "id" | "createdAt">) => void;
  updateBank: (
    id: string,
    updates: Partial<Omit<BankAccount, "id" | "createdAt">>,
  ) => void;
  deleteBank: (id: string) => void;
  toggleActive: (id: string) => void;
}

const INITIAL_BANKS: BankAccount[] = [
  {
    id: "b1",
    bankName: "Commercial Bank of Ethiopia",
    accountName: "STOCK UP PLC",
    accountNumber: "1000123456789",
    logo: "/bank/logo cbe.png",
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: "b2",
    bankName: "Awash Bank",
    accountName: "STOCK UP PLC",
    accountNumber: "0112345678",
    logo: "/bank/Awash-bank-logo.svg",
    isActive: true,
    createdAt: "2024-01-05",
  },
  {
    id: "b3",
    bankName: "Dashen Bank",
    accountName: "STOCK UP PLC",
    accountNumber: "0012345678",
    logo: "/bank/Dashen-Bank-Logo-Addis-Ababa-Ethiopia.png",
    isActive: false,
    createdAt: "2024-02-10",
  },
];

export const useBankStore = create<BankStore>()(
  persist(
    (set) => ({
      banks: INITIAL_BANKS,

      addBank: (bank) =>
        set((s) => ({
          banks: [
            ...s.banks,
            {
              ...bank,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      updateBank: (id, updates) =>
        set((s) => ({
          banks: s.banks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),

      deleteBank: (id) =>
        set((s) => ({ banks: s.banks.filter((b) => b.id !== id) })),

      toggleActive: (id) =>
        set((s) => ({
          banks: s.banks.map((b) =>
            b.id === id ? { ...b, isActive: !b.isActive } : b,
          ),
        })),
    }),
    { name: "bank-storage" },
  ),
);
