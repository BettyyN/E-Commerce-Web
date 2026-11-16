import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { CheckCircle2, FileText, History, Landmark, Receipt } from "lucide-react";
import type { CrdtPayPend } from "@/types/pay";

const payBadge = (status: string) =>
  status === "Pending"
    ? "bg-yellow-100 text-yellow-800"
    : status === "Rejected"
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";

interface CreditSummaryCardProps {
  status: string;
  pendingPayments: CrdtPayPend | null | undefined ;
  onReview: (p: CrdtPayPend) => void;
  onViewHistory: () => void;
  /* Passed only when the credit has been approved — opens the printable
     receipt generator. */
  onGenerateReceipt?: () => void;
}

export function CreditSummaryCard({
  status,
  pendingPayments,
  onReview,
  onViewHistory,
  onGenerateReceipt,
}: CreditSummaryCardProps) {
  const hasPending = !!pendingPayments;
  const isPaid = status === "Paid";
console.log("pendingPayments", pendingPayments);
  return (
    <Card className={`p-5 ${hasPending ? "border-yellow-200" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-yellow-600 shrink-0" />
          <p className="text-sm font-semibold text-brown-800">
            Pending Payments
          </p>
        </div>
        {hasPending && (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs shrink-0">
            Action needed
          </Badge>
        )}
      </div>

      {hasPending ? (
        <div className="mt-3 divide-y divide-slate-100">
          <div
            key={pendingPayments.id}
            className="py-3 first:pt-2 last:pb-0 space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-brown-900">
                {pendingPayments.amount}
              </p>
              <Badge className={`${payBadge(pendingPayments.status)} text-xs shrink-0`}>
                {pendingPayments.status}
                </Badge>
              </div>
              <p className="text-xs text-brown-500 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="inline-flex items-center gap-1">
                  <Landmark className="h-3 w-3" /> {pendingPayments.bank}
                </span>
                <span>·</span>
                <span>{pendingPayments.payMethod}</span>
                <span>·</span>
                <span>{pendingPayments.payDate?.split("T")[0]}</span>
              </p>
              <Button
                size="sm"
                onClick={() => onReview(pendingPayments)}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-semibold text-xs"
              >
                <Receipt className="h-3.5 w-3.5 mr-1.5" /> Review Receipt
              </Button>
            </div>
        </div>
      ) : (
        <p className="mt-4 text-xs text-brown-400 flex items-center gap-1.5">
          <CheckCircle2
            className={`h-3.5 w-3.5 shrink-0 ${isPaid ? "text-green-500" : "text-slate-300"}`}
          />
          No payments awaiting review.
        </p>
      )}

      <Button
        variant="outline"
        onClick={onViewHistory}
        className="w-full mt-4 border-brown-300 text-brown-700 hover:bg-yellow-50"
      >
        <History className="h-4 w-4 mr-2" /> Payment History
      </Button>

      {onGenerateReceipt && (
        <Button
          variant="outline"
          onClick={onGenerateReceipt}
          className="w-full mt-2 border-brown-300 text-brown-700 hover:bg-yellow-50"
        >
          <FileText className="h-4 w-4 mr-2" /> View Attachemnt
        </Button>
      )}
    </Card>
  );
}
