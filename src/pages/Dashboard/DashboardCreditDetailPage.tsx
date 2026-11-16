import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import { ArrowLeft } from "lucide-react";
import { DetailPageSkeleton } from "@/components/shared/PageSkeleton";
import { PageError } from "@/components/shared/PageError";
import { toast } from "sonner";
import { useCredit } from "@/service/credit/credit.queries";
import { useOrderItems } from "@/service/orderItem/orderItem.queries";
import { useCreditPendingPayments } from "@/service/pay/pay.queries";
import { useReviewCreditPayment } from "@/service/crdtPay/crdtPay.queries";
import type { CrdtPayPend } from "@/types/pay";
import { CustomerInfoCard } from "@/components/Dashboard/orders/shared/CustomerInfoCard";
import { OrderItemsTable } from "@/components/Dashboard/orders/shared/OrderItemsTable";
import { ReviewDecisionModal } from "@/components/Dashboard/orders/shared/ReviewDecisionModal";
import {
  EmbeddedCreditReceipt,
  ReceiptModalShell,
} from "@/components/Dashboard/orders/shared/EmbeddedReceiptModal";
import {
  CreditProgressCard,
  CreditHeading,
} from "@/components/Dashboard/orders/credit/CreditProgressCard";
import { CreditSummaryCard } from "@/components/Dashboard/orders/credit/CreditSummaryCard";

export default function DashboardCreditDetailPage() {
  const { creditId } = useParams<{ creditId: string }>();
  const navigate = useNavigate();

  const {
    data: credit,
    isLoading,
    error,
  } = useCredit(creditId ? decodeURIComponent(creditId) : undefined);
  const { data: items = [] } = useOrderItems(credit?.orderId);
  const { data: pendingPayments  } = useCreditPendingPayments(credit?.id);
  const reviewPayment = useReviewCreditPayment();

  const [reviewOpen, setReviewOpen] = useState(false);
  const [decideOpen, setDecideOpen] = useState(false);
  const [decideChoice, setDecideChoice] = useState<"approve" | "reject">(
    "approve",
  );
  const [activePay, setActivePay] = useState<CrdtPayPend | null>(null);

  if (error) {
    return (
      <DashboardLayout>
        <PageError
          message={error.message}
          onBack={() => navigate("/dashboard/credit")}
          backLabel="Back to Credit"
        />
      </DashboardLayout>
    );
  }

  if (isLoading || !credit) {
    return (
      <DashboardLayout>
        <DetailPageSkeleton />
      </DashboardLayout>
    );
  }

  const payPer = Math.min(100, Math.round(credit.payPer ?? 0));

  const openReview = (p: CrdtPayPend) => {
    setActivePay(p);
    setDecideChoice("approve");
    setReviewOpen(true);
  };

  const decide = async (stat: boolean) => {
    if (!activePay) return;
    try {
      const message = await reviewPayment.mutateAsync({
        id: activePay.id,
        stat,
      });
      toast.success(
        message ??
          (stat
            ? `Payment of ${activePay.amount} approved`
            : `Payment of ${activePay.amount} rejected`),
      );
      setReviewOpen(false);
      setDecideOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to review payment");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl space-y-4">
        <button
          onClick={() => navigate("/dashboard/credit")}
          className="flex items-center gap-1.5 text-sm text-brown-500 hover:text-brown-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Credit Management
        </button>

        <CreditHeading
          code={credit.code}
          orderCode={credit.orderCode}
          status={credit.status}
        />

        <CreditProgressCard
          total={credit.total}
          paid={credit.paid}
          remain={credit.remain}
          dueDate={credit.dueDate}
          status={credit.status}
          payPer={payPer}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          <div className="space-y-4">
            <CustomerInfoCard
              fullName={credit.fullName}
              email={credit.email}
              phoneNum={credit.phoneNum}
            />
            <OrderItemsTable
              items={items.map((i) => ({
                id: i.id,
                product: i.product,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                vat: i.vat,
                total: i.total,
                isDeleted: i.isDeleted,
              }))}
              showVat
            />
          </div>

          <div className="space-y-4">
            <CreditSummaryCard
              status={credit.status}
              pendingPayments={pendingPayments}
              onReview={openReview}
              onViewHistory={() =>
                navigate(
                  `/dashboard/credit/${encodeURIComponent(credit.id)}/payments`,
                )
              }
            />
          </div>
        </div>
      </div>

      {reviewOpen && activePay && (
        <ReceiptModalShell
          title="Payment Receipt"
          subtitle={`${activePay.payMethod} · ${activePay.bank}`}
          onClose={() => setReviewOpen(false)}
          onProceed={() => {
            setReviewOpen(false);
            setDecideOpen(true);
          }}
          proceedLabel="Review Payment"
        >
          <EmbeddedCreditReceipt id={activePay.id} />
        </ReceiptModalShell>
      )}

      {decideOpen && activePay && (
        <ReviewDecisionModal
          title="Payment Verification"
          subtitle={`${activePay.amount} via ${activePay.bank} — choose an action.`}
          choice={decideChoice}
          onChoiceChange={setDecideChoice}
          approveLabel="Approve"
          rejectLabel="Reject"
          approveDesc="Counts towards the credit balance"
          rejectDesc="Payment will not count towards the balance"
          onConfirm={() => decide(decideChoice === "approve")}
          onCancel={() => setDecideOpen(false)}
          isPending={reviewPayment.isPending}
        />
      )}
    </DashboardLayout>
  );
}
