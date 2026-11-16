import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Image as ImageIcon, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatETB } from "@/lib/utils";

export function CartItems() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-50 mb-5">
          <ShoppingCart className="h-9 w-9 text-yellow-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-slate-500 mb-6 max-w-xs">
          Looks like you haven't added anything yet. Browse our products and
          find something you love.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 px-8"
        >
          Continue Ordering
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.variantId} className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Image */}
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 sm:w-24 sm:h-24 object-contain rounded bg-brown-50"
              />
            ) : (
              <div className="w-full h-48 sm:w-24 sm:h-24 rounded bg-brown-50 flex items-center justify-center text-brown-300">
                <ImageIcon className="h-6 w-6" />
              </div>
            )}

            {/* Item Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-brown-900 mb-1 truncate">
                    {item.name}
                  </h3>

                  <p className="text-yellow-700 font-bold mb-3">
                    {formatETB(item.price)}
                  </p>
                </div>

                {/* Total - shown here on mobile */}
                <p className="font-bold text-brown-900 sm:hidden">
                  {formatETB(item.price * item.quantity)}
                </p>
              </div>

              {/* Quantity + Remove */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Stepper — matches ProductDetailInfo style */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border-2 border-slate-200 rounded-lg w-fit overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity - 1)
                      }
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-5 py-2 text-slate-900 font-semibold text-base border-x-2 border-slate-200 min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      disabled={item.stock >= 0 && item.quantity >= item.stock}
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity + 1)
                      }
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {item.packagingType && (
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
                      {item.packagingType}
                    </span>
                  )}
                </div>

                {item.stock > 0 && item.stock <= 5 && (
                  <span className="text-xs text-amber-600">
                    {item.stock} in stock
                  </span>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeItem(item.variantId)}
                  className="text-red-600 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            </div>

            {/* Total - desktop */}
            <div className="hidden sm:block text-right shrink-0">
              <p className="font-bold text-brown-900 whitespace-nowrap">
                {formatETB(item.price * item.quantity)}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
