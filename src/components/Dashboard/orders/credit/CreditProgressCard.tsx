import { Card } from "@/components/shared/ui/card";
import { Badge } from "@/components/shared/ui/badge";

interface CreditProgressCardProps {
  total: string;
  paid: string;
  remain: string;
  dueDate?: string;
  status: string;
  payPer: number;
}

export function CreditProgressCard({
  total,
  paid,
  remain,
  dueDate,
  status,
  payPer,
}: CreditProgressCardProps) {
  const isPaid = status === "Paid";
  const fmt = (s: string) => s || "0 ETB";
  const hasBalance = remain !== "0 ETB" && remain !== "0.00 ETB";

  return (
    <Card className="p-0 overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
        <div className="px-5 py-4">
          <p className="text-xs text-brown-400 mb-0.5">Total Credit</p>
          <p className="text-lg font-bold text-yellow-600">{fmt(total)}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-brown-400 mb-0.5">Paid</p>
          <p className="text-lg font-bold text-green-600">{fmt(paid)}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-brown-400 mb-0.5">Remaining</p>
          <p
            className={`text-lg font-bold ${hasBalance ? "text-red-600" : "text-slate-400"}`}
          >
            {fmt(remain)}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-brown-400 mb-0.5">Due Date</p>
          <p
            className={`text-sm font-semibold ${!isPaid ? "text-red-600" : "text-brown-900"}`}
          >
            {dueDate?.split("T")[0] || "—"}
          </p>
        </div>
      </div>
      <div className="px-5 pb-4 pt-1 border-t border-slate-50">
        <div className="flex justify-between text-xs text-brown-400 mb-1">
          <span>Payment progress</span>
          <span>{payPer}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${payPer === 100 ? "bg-green-500" : "bg-yellow-500"}`}
            style={{ width: `${payPer}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

export function CreditHeading({
  code,
  orderCode,
  status,
}: {
  code: string;
  orderCode: string;
  status: string;
}) {
  const isPaid = status === "Paid";
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-brown-900">Credit {code}</h1>
          <Badge
            className={
              isPaid
                ? "bg-green-100 text-green-700 text-xs"
                : "bg-red-100 text-red-700 text-xs"
            }
          >
            {status}
          </Badge>
        </div>
        <p className="text-sm text-brown-400 mt-0.5">Order {orderCode}</p>
      </div>
    </div>
  );
}
