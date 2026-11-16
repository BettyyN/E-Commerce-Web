import { Card } from "@/components/shared/ui/card";
import type { OrderItemListDto } from "@/types/orderItem";
import { ShoppingBag } from "lucide-react";

interface OrderItemsTableProps {
  items: OrderItemListDto[];
  showVat?: boolean;
}

export function OrderItemsTable({
  items,
  showVat = false,
}: OrderItemsTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-slate-100">
        <ShoppingBag className="h-4 w-4 text-brown-400" />
        <p className="text-sm font-semibold text-brown-800">
          Order Items ({items.length})
        </p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="text-left px-5 py-2.5 text-xs font-medium text-brown-400">
              Item
            </th>
            <th className="text-right px-4 py-2.5 text-xs font-medium text-brown-400">
              Unit Price
            </th>
            {showVat && (
              <th className="text-right px-4 py-2.5 text-xs font-medium text-brown-400">
                VAT
              </th>
            )}
            <th className="text-center px-4 py-2.5 text-xs font-medium text-brown-400">
              Qty
            </th>
            <th className="text-right px-5 py-2.5 text-xs font-medium text-brown-400">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.length === 0 && (
            <tr>
              <td
                colSpan={showVat ? 5 : 4}
                className="px-5 py-8 text-center text-sm text-brown-400"
              >
                No item details available
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-yellow-50/20 transition-colors"
            >
              <td className="px-5 py-3 font-medium text-brown-900 text-sm">
                {item.product}
              </td>
              <td className="px-4 py-3 text-right text-brown-500 text-sm">
                { item.unitPrice}
              </td>
              {showVat && (
                <td className="px-4 py-3 text-right text-brown-500 text-sm">
                  {item.vat }
                </td>
              )}
              <td className="px-4 py-3 text-center text-brown-500 text-sm">
                {item.quantity}
              </td>
              <td className="px-5 py-3 text-right font-semibold text-brown-900 text-sm">
                { item.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {showVat && subtotal !== undefined && totalVat !== undefined && (
        <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex justify-end gap-8 text-sm font-bold text-brown-900">
          <span>Subtotal</span>
          <span>{subtotal.toLocaleString()} ETB</span>
          <span className="text-brown-400">VAT</span>
          <span>{totalVat.toLocaleString()} ETB</span>
        </div>
      )} */}
    </Card>
  );
}
