import { Card } from "@/components/shared/ui/card";
import { Badge } from "@/components/shared/ui/badge";
import { CreditCard, CalendarDays, Landmark, Receipt } from "lucide-react";
import { formatETB } from "@/lib/utils";
import { getPaymentStatusColor } from "@/lib/format";

interface Payment {
  bank?: string;
  payAmount?: string;
  payMethod?: string;
  status: string;
}

interface OrderSummaryCardProps {
  subTotal: number;
  vat: number;
  total: number;
  orderDate: string;
  paymentLabel: string;
  payment?: Payment;
  isCredit: boolean;
}

export function OrderSummaryCard({
  subTotal,
  vat,
  total,
  orderDate,
  paymentLabel,
  payment,
  isCredit,
}: OrderSummaryCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-4 w-4 text-brown-400" />
        <p className="text-sm font-semibold text-brown-800">Summary</p>
      </div>

      {/* Totals — plain rows matching admin style */}
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-brown-500">
          <span>Subtotal</span>
          <span>{formatETB(subTotal)}</span>
        </div>
        <div className="flex justify-between text-brown-500">
          <span>VAT</span>
          <span>{formatETB(vat)}</span>
        </div>
        <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center">
          <span className="font-semibold text-brown-900">Total</span>
          <span className="text-base font-bold text-yellow-600">
            {formatETB(total)}
          </span>
        </div>
      </div>

      {/* Payment details */}
      <div className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between text-brown-500">
          <span>Payment</span>
          <Badge className={getPaymentStatusColor(paymentLabel)}>
            {paymentLabel}
          </Badge>
        </div>
        {payment && (
          <>
            <div className="flex justify-between text-brown-500">
              <span className="flex items-center gap-1.5">
                <Landmark className="h-3 w-3" /> Bank
              </span>
              <span className="font-semibold text-brown-900">
                {payment.bank || "—"}
              </span>
            </div>
            <div className="flex justify-between text-brown-500">
              <span>Paid Amount</span>
              <span className="font-semibold text-brown-900">
                {payment.payAmount}
              </span>
            </div>
            <div className="flex justify-between text-brown-500">
              <span className="flex items-center gap-1.5">
                <Receipt className="h-3 w-3" /> Method
              </span>
              <span className="font-semibold text-brown-900">
                {payment.payMethod}
              </span>
            </div>
          </>
        )}
        {isCredit && (
          <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2.5">
            <span className="text-xs font-medium text-blue-600">
              Credit Order
            </span>
            <span className="text-xs font-medium text-blue-700">
              Track it from Credits
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-brown-400 border-t border-slate-100 pt-4">
        <CalendarDays className="h-3 w-3 shrink-0" /> Ordered on {orderDate}
      </div>
    </Card>
  );
}
