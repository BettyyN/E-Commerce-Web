import { useState } from "react";
import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog";
import { Landmark, CreditCard, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useCreditReceipt } from "@/service/pay/pay.queries";
import { useDeleteCreditPayment } from "@/service/crdtPay/crdtPay.queries";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { getCrdtPayStatusColor } from "@/lib/format";

interface Payment {
  id: string;
  code: string;
  bank: string;
  amount: string;
  status: string;
  payMethod?: string;
  payDate?: string;
}

function PaymentReceiptButton({ paymentId }: { paymentId: string }) {
  const [open, setOpen] = useState(false);
  const { data: url, isLoading } = useCreditReceipt(
    open ? paymentId : undefined,
  );

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setOpen(true)}
        className="h-7 px-2 text-xs text-yellow-700 hover:bg-yellow-50"
      >
        {isLoading ? "Loading…" : "View"}
      </Button>
      {url && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Payment Receipt</DialogTitle>
            </DialogHeader>
            <iframe src={url} className="w-full h-96" title="Receipt" />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

interface PaymentHistoryTableProps {
  payments: Payment[];
}

function CancelPaymentButton({ paymentId }: { paymentId: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cancelPayment = useDeleteCreditPayment();

  const handleCancel = async () => {
    try {
      const message = await cancelPayment.mutateAsync(paymentId);
      toast.success(message ?? "Payment cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel payment");
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setConfirmOpen(true)}
        disabled={cancelPayment.isPending}
        className="h-7 px-2 text-xs text-red-600 hover:bg-red-50"
      >
        <XCircle className="h-3.5 w-3.5 mr-1" />
        {cancelPayment.isPending ? "Cancelling…" : "Cancel"}
      </Button>
      <DeleteConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Cancel Payment"
        description="Are you sure you want to cancel this payment? This cannot be undone."
        confirmLabel="Cancel Payment"
        onConfirm={handleCancel}
      />
    </>
  );
}

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
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
          No payments yet. Use "Pay Now" to settle this credit.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="text-left px-5 py-2.5 text-xs font-medium text-brown-400">
                Code
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-brown-400">
                <span className="flex items-center gap-1.5">
                  <Landmark className="h-3 w-3" /> Bank / Method
                </span>
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-brown-400">
                Amount
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-brown-400">
                Paid On
              </th>
              <th className="text-center px-4 py-2.5 text-xs font-medium text-brown-400">
                Status
              </th>
              <th className="text-center px-4 py-2.5 text-xs font-medium text-brown-400">
                Actions
              </th>
              <th className="text-right px-5 py-2.5 text-xs font-medium text-brown-400">
                Receipt
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
                  {p.bank}
                  {p.payMethod ? ` · ${p.payMethod}` : ""}
                </td>
                <td className="px-4 py-3.5 text-right font-semibold text-brown-900">
                  {p.amount}
                </td>
                <td className="px-4 py-3.5 text-brown-500">
                  {p.payDate?.split("T")[0] || "—"}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <Badge className={getCrdtPayStatusColor(p.status)}>
                    {p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-center">
                  {p.status === "Pending" ? (
                    <CancelPaymentButton paymentId={p.id} />
                  ) : (
                    <span className="text-xs text-brown-300">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <PaymentReceiptButton paymentId={p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
