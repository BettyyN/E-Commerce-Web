import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import {
  CreditCard,
  Receipt,
  Clock,
  ExternalLink,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const payBadge = (status: string) =>
  status === "Pending"
    ? "bg-yellow-100 text-yellow-800"
    : status === "Rejected"
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";

interface PaymentDetailsCardProps {
  payment: {
    id: string;
    status: string;
    payMethod: string;
    payAmount: string;
    bank: string;
    payDate?: string;
  };
  isCheque: boolean;
  isPending: boolean;
  onViewReceipt: () => void;
  onReview: () => void;
  /* Passed only when a generated (printable) receipt makes sense —
     verified payment / approved credit. */
  onGenerateReceipt?: () => void;
}

export function PaymentDetailsCard({
  payment,
  isCheque,
  isPending,
  onViewReceipt,
  onReview,
  onGenerateReceipt,
}: PaymentDetailsCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-brown-400" />
          <p className="text-sm font-semibold text-brown-800">
            Payment Details
          </p>
        </div>
        <Badge className={payBadge(payment.status)}>{payment.status}</Badge>
      </div>

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-brown-500">
          <span>Method</span>
          <span className="font-semibold text-brown-900">
            {payment.payMethod}
          </span>
        </div>
        <div className="flex justify-between text-brown-500">
          <span>Amount</span>
          <span className="font-semibold text-brown-900">
            {payment.payAmount}
          </span>
        </div>
        <div className="flex justify-between text-brown-500">
          <span className="flex items-center gap-1.5">Bank</span>
          <span className="font-semibold text-brown-900">{payment.bank}</span>
        </div>
        <div className="flex justify-between text-brown-500">
          <span>Paid On</span>
          <span className="font-semibold text-brown-900">
            {payment.payDate?.split("T")[0] || "—"}
          </span>
        </div>
      </div>

      <div className=" flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewReceipt}
          className="w-full border-brown-300 text-brown-700 hover:bg-yellow-50"
        >
          <Receipt className="h-3.5 w-3.5 mr-2" /> View{" "}
          {isCheque ? "Cheque" : "Receipt"}
        </Button>
        {onGenerateReceipt && (
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerateReceipt}
            className="w-full border-brown-300 text-brown-700 hover:bg-yellow-50"
          >
            <FileText className="h-3.5 w-3.5 mr-2" /> View Attachemnt
          </Button>
        )}
        {isPending && (
          <Button
            onClick={onReview}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-semibold text-sm"
          >
            <Receipt className="h-4 w-4 mr-2" /> Review Payment
          </Button>
        )}
      </div>
    </Card>
  );
}

export function CreditReviewCard({
  isPending,
  onReview,
  orderId,
  onGenerateReceipt,
}: {
  isPending: boolean;
  onReview: () => void;
  orderId?: string;
  /* Passed only when the credit has been approved. */
  onGenerateReceipt?: () => void;
}) {
  const navigate = useNavigate();
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-brown-400" />
        <p className="text-sm font-semibold text-brown-800">Credit Order</p>
      </div>
      <p className="text-xs text-brown-500 leading-relaxed">
        This order was placed on credit — no upfront payment to verify.
      </p>
      <div className="flex flex-col gap-2">
        {orderId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/dashboard/orders/${orderId}/credit`)}
            className="w-full border-brown-300 text-brown-700 hover:bg-yellow-50"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-2" /> View Credit Details
          </Button>
        )}
        {onGenerateReceipt && (
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerateReceipt}
            className="w-full border-brown-300 text-brown-700 hover:bg-yellow-50"
          >
            <FileText className="h-3.5 w-3.5 mr-2" /> View Attachemnt
          </Button>
        )}
        {isPending && (
          <Button
            onClick={onReview}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-semibold text-sm"
          >
            <Clock className="h-4 w-4 mr-2" /> Review Credit
          </Button>
        )}
      </div>
    </Card>
  );
}
