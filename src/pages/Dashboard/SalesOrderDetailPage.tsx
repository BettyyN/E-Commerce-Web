import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import { Badge } from "@/components/shared/ui/badge";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { ArrowLeft, MessageSquareText, CalendarClock } from "lucide-react";
import { DetailPageSkeleton } from "@/components/shared/PageSkeleton";
import { PageError } from "@/components/shared/PageError";
import { toast } from "sonner";
import {
  useOrder,
  useVerifyOrder,
  useReviewCreditOrder,
} from "@/service/order/order.queries";
import { useOrderItems } from "@/service/orderItem/orderItem.queries";
import {
  useCreditsPaid,
  useCreditsUnpaid,
} from "@/service/credit/credit.queries";
import { useOrderPayment } from "@/service/pay/pay.queries";
import { CustomerInfoCard } from "@/components/Dashboard/orders/shared/CustomerInfoCard";
import { OrderItemsTable } from "@/components/Dashboard/orders/shared/OrderItemsTable";
import { ReviewDecisionModal } from "@/components/Dashboard/orders/shared/ReviewDecisionModal";
import {
  EmbeddedOrderReceipt,
  ReceiptModalShell,
} from "@/components/Dashboard/orders/shared/EmbeddedReceiptModal";
import {
  PaymentDetailsCard,
  CreditReviewCard,
} from "@/components/Dashboard/orders/sales/PaymentDetailsCard";
import { GenerateReceiptModal } from "@/components/Dashboard/orders/sales/GenerateReceiptModal";
import {
  buildReceiptOrder,
  toNumber,
} from "@/lib/receiptOrder";

export default function SalesOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const {
    data: order,
    isLoading,
    error,
  } = useOrder(orderId ? decodeURIComponent(orderId) : undefined);
  const { data: items = [] } = useOrderItems(order?.id);
  const { data: payment } = useOrderPayment(order?.id);
  const verifyOrder = useVerifyOrder();
  const reviewCredit = useReviewCreditOrder();

  const { data: creditsPaid = [] } = useCreditsPaid();
  const { data: creditsUnpaid = [] } = useCreditsUnpaid();
  const remark =
    [...creditsPaid, ...creditsUnpaid].find((c) => c.orderCode === order?.code)
  ?.remark ?? "";

  const [verifyOpen, setVerifyOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [verifyChoice, setVerifyChoice] = useState<"approve" | "reject">(
    "approve",
  );
  const [creditOpen, setCreditOpen] = useState(false);
  const [creditChoice, setCreditChoice] = useState<"approve" | "reject">(
    "approve",
  );
  const [days, setDays] = useState("30");

  if (error) {
    return (
      <DashboardLayout>
        <PageError
          message={error.message}
          onBack={() => navigate("/dashboard/orders")}
          backLabel="Back to Orders"
        />
      </DashboardLayout>
    );
  }

  if (isLoading || !order) {
    return (
      <DashboardLayout>
        <DetailPageSkeleton />
      </DashboardLayout>
    );
  }

  const lineRows = items.map((i) => ({
    id: i.id,
    product: i.product,
    quantity: i.quantity,
    unitPrice: i.unitPrice,
    vat: i.vat,
    total: i.total,
    isDeleted: i.isDeleted,
  }));

  const subtotal = lineRows.reduce(
    (sum, item) => sum + toNumber(item.unitPrice) * item.quantity,
    0,
  );
  const totalVat = lineRows.reduce((sum, item) => sum + toNumber(item.vat), 0);
  const total = order.total ? toNumber(order.total) : subtotal + totalVat;

  const isPending = order.status === "Pending";
  const isCredit = order.isCredit;
  const isCheque = !!payment?.payMethod.toLowerCase().includes("cheque");

  const canGenerateReceipt = isCredit
    ? order.status === "Approved"
    : payment?.status === "Approved" && !isPending;
  const handleVerify = async () => {
    const stat = verifyChoice === "approve";
    try {
      const message = await verifyOrder.mutateAsync({ id: order.id, stat });
      toast.success(
        message ??
          (stat
            ? `Payment for ${order.code} verified`
            : `Payment for ${order.code} rejected`),
      );
      setVerifyOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to verify payment");
    }
  };

  const handleCreditReview = async () => {
    const stat = creditChoice === "approve";
    const daysNum = parseInt(days);
    if (stat && (!Number.isFinite(daysNum) || daysNum <= 0)) {
      toast.error("Days to pay must be greater than zero");
      return;
    }
    try {
      const message = await reviewCredit.mutateAsync({
        id: order.id,
        stat,
        days: daysNum,
      });
      toast.success(
        message ??
          (stat
            ? `Credit approved — ${daysNum} days to pay`
            : "Credit request rejected"),
      );
      setCreditOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to review credit");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl space-y-4">
        <button
          onClick={() => navigate("/dashboard/orders")}
          className="flex items-center gap-1.5 text-sm text-brown-500 hover:text-brown-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </button>

        {/* Heading */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-brown-900">
                Order {order.code}
              </h1>
              <Badge
                className={
                  order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                }
              >
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-brown-400 mt-0.5">
              Placed on {order.orderDateAt?.split("T")[0]} · Shipping:{" "}
              {order.hasShipping}
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <Card className="p-0 overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-0.5">Subtotal</p>
              <p className="text-lg font-bold text-brown-900">
                {order.subTotal || `${subtotal.toLocaleString()} ETB`}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-0.5">VAT</p>
              <p className="text-lg font-bold text-brown-900">
                {order.vat || `${totalVat.toLocaleString()} ETB`}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-0.5">Total</p>
              <p className="text-lg font-bold text-yellow-600">
                {order.total || `${total.toLocaleString()} ETB`}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-0.5">Items</p>
              <p className="text-lg font-bold text-brown-900">
                {lineRows.length}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-0.5">Is Credit</p>
              <p className="text-lg font-bold text-brown-900">
                {order.isCreditStr}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <div className="space-y-4">
            <CustomerInfoCard
              fullName={order.fullName}
              email={order.email}
              phoneNum={order.phoneNum}
              tin={order.tin}
            />
            <OrderItemsTable items={lineRows} showVat />
          </div>

          <div className="space-y-4">
            {!isCredit && payment && (
              <PaymentDetailsCard
                payment={payment}
                isCheque={isCheque}
                isPending={isPending}
                onViewReceipt={() => setReceiptOpen(true)}
                onReview={() => {
                  setVerifyChoice("approve");
                  setVerifyOpen(true);
                }}
                onGenerateReceipt={
                  canGenerateReceipt ? () => setGenerateOpen(true) : undefined
                }
              />
            )}
            {isCredit && (
              <CreditReviewCard
                isPending={isPending}
                orderId={order.id}
                onReview={() => {
                  setCreditChoice("approve");
                  setDays("30");
                  setCreditOpen(true);
                }}
                onGenerateReceipt={
                  canGenerateReceipt ? () => setGenerateOpen(true) : undefined
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Receipt modal */}
      {receiptOpen && payment && (
        <ReceiptModalShell
          title={isCheque ? "Cheque Document" : "Payment Receipt"}
          subtitle={`${payment.payMethod} · ${payment.bank}`}
          onClose={() => setReceiptOpen(false)}
        >
          <EmbeddedOrderReceipt paymentId={payment.id} />
        </ReceiptModalShell>
      )}

      {/* Generated (printable) receipt — verified payment / approved credit */}
      {generateOpen && (
        <GenerateReceiptModal
          open
          onClose={() => setGenerateOpen(false)}
          order={buildReceiptOrder(order, items, payment?.payMethod)}
        />
      )}

      {/* Verify payment modal */}
      {verifyOpen && (
        <ReviewDecisionModal
          title="Payment Verification"
          subtitle="Choose an action for this payment."
          choice={verifyChoice}
          onChoiceChange={setVerifyChoice}
          approveLabel="Approve"
          rejectLabel="Reject"
          approveDesc="Verified — moves to store keeper"
          rejectDesc="Reject and cancel the order"
          onConfirm={handleVerify}
          onCancel={() => setVerifyOpen(false)}
          isPending={verifyOrder.isPending}
        />
      )}

      {/* Credit review modal */}
      {creditOpen && (
        <ReviewDecisionModal
          title="Credit Review"
          subtitle={`Order ${order.code} — choose an action for this credit request.`}
          choice={creditChoice}
          onChoiceChange={setCreditChoice}
          approveLabel="Approve"
          rejectLabel="Decline"
          approveDesc="Sets the days the customer has to pay"
          rejectDesc="Reject and notify the customer"
          onConfirm={handleCreditReview}
          onCancel={() => setCreditOpen(false)}
          isPending={reviewCredit.isPending}
          extra={
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                <p className="text-xs font-medium text-brown-500 mb-1 flex items-center gap-1.5">
                  <MessageSquareText className="h-3 w-3" /> Customer's request
                  note
                </p>
                <p className="text-sm text-brown-800 leading-relaxed">
                  {remark || "The customer did not leave a note."}
                </p>
              </div>
              {creditChoice === "approve" && (
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-sm font-medium text-brown-700">
                    <CalendarClock className="h-3.5 w-3.5" /> Days to Pay{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    autoFocus
                  />
                </div>
              )}
            </div>
          }
        />
      )}
    </DashboardLayout>
  );
}
