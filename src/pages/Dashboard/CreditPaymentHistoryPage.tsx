import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import { Badge } from "@/components/shared/ui/badge";
import { Card } from "@/components/shared/ui/card";
import { ArrowLeft, CreditCard, Landmark } from "lucide-react";
import { useCredit } from "@/service/credit/credit.queries";
import { useCreditPayments } from "@/service/pay/pay.queries";
import { TablePageSkeleton } from "@/components/shared/PageSkeleton";
import { PageError } from "@/components/shared/PageError";

const payBadge = (status: string) =>
  status === "Pending"
    ? "bg-yellow-100 text-yellow-800"
    : status === "Rejected"
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";

export default function CreditPaymentHistoryPage() {
  const { creditId } = useParams<{ creditId: string }>();
  const navigate = useNavigate();

  const {
    data: credit,
    isLoading: creditLoading,
    error,
  } = useCredit(creditId ? decodeURIComponent(creditId) : undefined);
  const { data: payments = [], isLoading: paymentsLoading } = useCreditPayments(
    credit?.id,
  );

  const isLoading = creditLoading || paymentsLoading;

  if (error) {
    return (
      <DashboardLayout>
        <PageError
          message={error.message}
          onBack={() => navigate(-1)}
          backLabel="Back"
        />
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <TablePageSkeleton rows={5} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-brown-500 hover:text-brown-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Credit Detail
        </button>

        <div>
          <h1 className="text-2xl font-bold text-brown-900 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-yellow-600" />
            Payment History
          </h1>
          {credit && (
            <p className="text-sm text-brown-500 mt-0.5">
              Credit {credit.code} · {payments.length} payment
              {payments.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <Card className="overflow-hidden">
          {payments.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-brown-400">
              No payments submitted yet for this credit.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-medium text-brown-400">
                    Code
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brown-400">
                    <span className="flex items-center gap-1.5">
                      <Landmark className="h-3 w-3" /> Bank / Method
                    </span>
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-brown-400">
                    Amount
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brown-400">
                    Paid On
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-brown-400">
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
                    <td className="px-5 py-3.5 font-medium text-brown-900">
                      {p.code}
                    </td>
                    <td className="px-4 py-3.5 text-brown-500">
                      {p.bank} · {p.payMethod}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-brown-900">
                      {p.amount}
                    </td>
                    <td className="px-4 py-3.5 text-brown-500">
                      {p.payDate?.split("T")[0] || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Badge className={`${payBadge(p.status)} text-xs`}>
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
