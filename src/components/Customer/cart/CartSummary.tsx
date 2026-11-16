import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Separator } from "@/components/shared/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { formatETB } from "@/lib/utils";

const FREE_DELIVERY_THRESHOLD = 700_000;

export function CartSummary() {
  const navigate = useNavigate();
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const items = useCartStore((state) => state.items);

  // Prices already include VAT
  const subtotal = getTotalPrice();
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const total = subtotal;

  return (
    <Card className="p-4 sticky top-4 space-y-2">
      <h2 className="text-xl font-bold text-brown-900">Order Summary</h2>

      <div className="space-y-2">
        <div className="flex justify-between text-brown-700">
          <span>
            Subtotal ({items.reduce((n, i) => n + i.quantity, 0)} items)
          </span>
          <span>{formatETB(subtotal)}</span>
        </div>
        <div className="flex justify-between text-brown-700">
          <span>VAT</span>
          <span>Included</span>
        </div>
        <div className="flex justify-between text-brown-700">
          <span>Delivery</span>
          {isFreeDelivery && subtotal > 0 ? (
            <span className="text-green-600 font-medium">Free 🎉</span>
          ) : (
            <span className="text-red-600 font-medium">Not Available</span>
          )}
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-bold text-brown-900">
        <span>Total</span>
        <span>{formatETB(total)}</span>
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-500">
        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" />
        <span>
          Free delivery on orders of{" "}
          <span className="font-medium text-slate-700">
            {FREE_DELIVERY_THRESHOLD.toLocaleString()} ETB
          </span>{" "}
          or more.
        </span>
      </div>

      <Button
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-semibold"
        disabled={items.length === 0}
        onClick={() => navigate("/checkout")}
      >
        Proceed to Order
      </Button>

      <Button
        variant="outline"
        className="w-full text-brown-700 hover:bg-yellow-50"
        onClick={() => navigate("/")}
      >
        Continue Ordering
      </Button>
    </Card>
  );
}
