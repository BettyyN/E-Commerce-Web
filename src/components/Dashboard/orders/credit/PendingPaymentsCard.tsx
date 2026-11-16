import { Card } from "@/components/shared/ui/card";
import { Badge } from "@/components/shared/ui/badge";
import { CreditCard } from "lucide-react";

interface CreditPaymentHistoryProps {
  payments: {
    id: string;
    code: string;
    bank: string;
    amount: string;
    payMethod: string;
    payDate?: string;
    status: string;
  }[];
}

export function CreditPaymentHistory({ payments }: CreditPaymentHistoryProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-slate-100">
        <CreditCard className="h-4 w-4 text-brown-400" />
        <p className="text-sm font-semibold text-brown-800">
          Payment History ({payments.length})
        </p>
      </div>
      {payments.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-brown-400">
          No payments submitted yet
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="text-left px-5 py-2.5 text-xs font-medium text-brown-400">
                Code
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-brown-400">
                Bank / Method
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-brown-400">
                Amount
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-brown-400">
                Paid On
              </th>
              <th className="text-right px-5 py-2.5 text-xs font-medium text-brown-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-yellow-50/20 transition-colors"
              >
                <td className="px-5 py-3 font-medium text-brown-900 text-sm">
                  {p.code}
                </td>
                <td className="px-4 py-3 text-brown-500 text-sm">
                  {p.bank} · {p.payMethod}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-brown-900 text-sm">
                  {p.amount}
                </td>
                <td className="px-4 py-3 text-brown-500 text-sm">
                  {p.payDate?.split("T")[0] || "—"}
                </td>
                <td className="px-5 py-3 text-right">
                  <Badge
                    className={`${p.status === "Pending" ? "bg-yellow-100 text-yellow-800" : p.status === "Rejected" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"} text-xs`}
                  >
                    {p.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
