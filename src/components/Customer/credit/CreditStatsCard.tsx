import { Card } from "@/components/shared/ui/card";
import { formatETB } from "@/lib/utils";

interface CreditStatsCardProps {
  total: number;
  paid: number;
  remain: number;
  payPer: number;
  appDate: string;
  dueDate: string;
}

export function CreditStatsCard({
  total,
  paid,
  remain,
  payPer,
  appDate,
  dueDate,
}: CreditStatsCardProps) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-slate-100">
        <div className="px-5 py-4">
          <p className="text-xs text-brown-400 mb-0.5">Total Credit</p>
          <p className="text-lg font-bold text-yellow-600">
            {formatETB(total)}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-brown-400 mb-0.5">Paid</p>
          <p className="text-lg font-bold text-green-600">{formatETB(paid)}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-brown-400 mb-0.5">Remaining</p>
          <p
            className={`text-lg font-bold ${remain > 0 ? "text-red-600" : "text-slate-400"}`}
          >
            {formatETB(remain)}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-brown-400 mb-0.5">Approved on</p>
          <p className="text-md font-medium">{appDate}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-brown-400 mb-0.5">Due Date</p>
          <p className="text-md font-medium">{dueDate}</p>
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
