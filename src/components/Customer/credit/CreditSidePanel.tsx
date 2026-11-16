import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { CreditCard, Link2, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatETB } from "@/lib/utils";
import { getCreditStatusColor, fmtDate } from "@/lib/format";

interface CreditSummaryProps {
  appDate: string;
  dueDate: string;
  payPer: string;
  remain: number;
  isPaid: boolean;
}

interface RelatedOrder {
  id: string;
  code: string;
  orderDateAt: string;
  total: string;
  status: string;
}

interface CreditSidePanelProps {
  summary: CreditSummaryProps;
  order?: RelatedOrder;
}

export function CreditSidePanel({ summary, order }: CreditSidePanelProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Credit summary — matches admin CreditSummaryCard style */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-4 w-4 text-brown-400" />
          <p className="text-sm font-semibold text-brown-800">Credit Summary</p>
        </div>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between text-brown-500">
            <span>Approved On</span>
            <span className="font-semibold text-brown-900">
              {fmtDate(summary.appDate)}
            </span>
          </div>
          <div className="flex justify-between text-brown-500">
            <span>Progress</span>
            <span className="font-semibold text-brown-900">
              {summary.payPer}%
            </span>
          </div>
          <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center">
            <span className="font-semibold text-brown-900">Balance Due</span>
            <span
              className={`text-base font-bold ${summary.remain > 0 ? "text-red-600" : "text-green-600"}`}
            >
              {formatETB(summary.remain)}
            </span>
          </div>
        </div>
        {/* Status */}
        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
          <span className="text-xs font-medium text-brown-500">Status</span>
          <Badge
            className={
              summary.isPaid
                ? "bg-green-100 text-green-700 text-xs"
                : "bg-red-100 text-red-700 text-xs"
            }
          >
            {summary.isPaid ? "Paid" : "Unpaid"}
          </Badge>
        </div>
        {/* Due date */}
        <div
          className={`mt-2 flex items-center justify-between rounded-lg px-3 py-2.5 ${!summary.isPaid ? "bg-red-50" : "bg-slate-50"}`}
        >
          <div className="flex items-center gap-1.5">
            <Calendar
              className={`h-3.5 w-3.5 ${!summary.isPaid ? "text-red-500" : "text-brown-400"}`}
            />
            <span
              className={`text-xs font-medium ${!summary.isPaid ? "text-red-600" : "text-brown-500"}`}
            >
              Due Date
            </span>
          </div>
          <span
            className={`text-xs font-semibold ${!summary.isPaid ? "text-red-600" : "text-brown-800"}`}
          >
            {fmtDate(summary.dueDate)}
          </span>
        </div>
      </Card>

      {/* Related order */}
      {order && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="h-4 w-4 text-brown-400" />
            <p className="text-sm font-semibold text-brown-800">
              Related Order
            </p>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-brown-500">
              <span>Order</span>
              <span className="font-medium text-brown-900">{order.code}</span>
            </div>
            <div className="flex justify-between text-brown-500">
              <span>Date</span>
              <span className="text-brown-700">
                {fmtDate(order.orderDateAt)}
              </span>
            </div>
            <div className="flex justify-between text-brown-500">
              <span>Total</span>
              <span className="font-medium text-brown-900">{order.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brown-500">Status</span>
              <Badge
                className={getCreditStatusColor(
                  order.status === "Approved" ? "Paid" : order.status,
                )}
              >
                {order.status}
              </Badge>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/customer/orders/${order.id}`)}
            className="w-full mt-3 border-slate-200 text-brown-700 hover:bg-yellow-50 text-xs"
          >
            View Order Details
          </Button>
        </Card>
      )}
    </div>
  );
}
