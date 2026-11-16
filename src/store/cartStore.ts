import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  variantId: string; // matches OrderItemsAdd.variantId
  name: string; // product + variant label
  price: number; // current unit price, VAT included
  quantity: number;
  image?: string; // object URL or public path
  stock: number; // known stock; -1 = unknown, don't clamp
  packagingType?: string; // e.g. "Carton", "Bottle" — shown next to the quantity stepper
}

interface CartStore {
  items: CartItem[];
  addItem: (
    item: Omit<CartItem, "quantity">,
    quantity?: number,
  ) => "added" | "merged" | "max";
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const clamp = (quantity: number, stock: number) =>
  stock >= 0 ? Math.min(Math.max(quantity, 0), stock) : Math.max(quantity, 0);

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);

        if (existing) {
          const next = clamp(existing.quantity + quantity, existing.stock);
          if (next === existing.quantity) return "max";
          set({
            items: items.map((i) =>
              i.variantId === item.variantId ? { ...i, ...item, quantity: next } : i,
            ),
          });
          return "merged";
        }

        const safeQty = clamp(quantity, item.stock);
        set({ items: [...items, { ...item, quantity: safeQty }] });
        return "added";
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((item) => item.variantId !== variantId) });
      },

      updateQuantity: (variantId, quantity) => {
        set({
          items: get().items.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: clamp(quantity, item.stock) }
              : item,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    { name: "elu-cart" },
  ),
);
