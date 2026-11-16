import { Card } from "@/components/shared/ui/card";
import { Separator } from "@/components/shared/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { formatETB } from "@/lib/utils";

const FREE_DELIVERY_THRESHOLD = 700_000;

export function CheckoutSummary() {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  // Prices already include VAT
  const subtotal = getTotalPrice();
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const total = subtotal;

  return (
<Card className="p-6 sticky">
  <h2 className="text-xl font-bold text-brown-900">
    Order Summary
  </h2>

  {/* Items Table */}
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-left">
          <th className="pb-3 font-medium text-gray-500">Product</th>
          <th className="pb-3 px-3 text-center font-medium text-gray-500">
            Qty
          </th>
          <th className="pb-3 px-3 text-right font-medium text-gray-500">
            Price
          </th>
          <th className="pb-3 pl-3 text-right font-medium text-gray-500">
            Total
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {items.map((item) => (
          <tr key={item.variantId}>
            <td className="py-3 pr-2">
              <span className="text-brown-700 font-medium leading-snug">
                {item.name}
              </span>
            </td>

            <td className="py-3 px-3 text-center text-brown-700">
              {item.quantity}
            </td>

            <td className="py-3 px-3 text-right text-brown-700 whitespace-nowrap">
              {formatETB(item.price)}
            </td>

            <td className="py-3 pl-3 text-right font-semibold text-brown-900 whitespace-nowrap">
              {formatETB(item.price * item.quantity)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {items.length === 0 && (
      <p className="py-4 text-sm text-slate-400 text-center">
        Your cart is empty
      </p>
    )}
  </div>

  <Separator  />

  {/* Delivery + Total */}
  <div className="space-y-3">
    <div className="flex justify-between text-brown-700">
      <span>Free Delivery</span>

      {isFreeDelivery && subtotal > 0 ? (
        <span className="text-green-600 font-medium">Free</span>
      ) : (
        <span className="text-red-600 font-medium">Not Available</span>
      )}
    </div>

    <div className="flex justify-between text-lg font-bold text-brown-900">
      <span>Total</span>
      <span>{formatETB(total)}</span>
    </div>

    {/* VAT Note */}
    <p className="text-xs text-gray-500 text-right">
      15% VAT is included in the total price.
    </p>
  </div>
</Card>
  );
}
