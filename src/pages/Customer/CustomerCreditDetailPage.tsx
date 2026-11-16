import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/shared/Header";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Card } from "@/components/shared/ui/card";
import { ArrowLeft, Wallet, History, Landmark, Receipt } from "lucide-react";
import { DetailPageSkeleton } from "@/components/shared/PageSkeleton";
import { PageError } from "@/components/shared/PageError";
import { useCreditPayments, useCreditPendingPayments } from "@/service/pay/pay.queries";
import { useOrderItems } from "@/service/orderItem/orderItem.queries";
import { useAddCreditPayment } from "@/service/crdtPay/crdtPay.queries";
import { getCreditStatusColor, getCrdtPayStatusColor, fmtDate, parseMoney } from "@/lib/format";
import { PayMethod } from "@/types/enum";
import { toast } from "sonner";
import type { BankIconList } from "@/types/bank";
import { CreditStatsCard } from "@/components/Customer/credit/CreditStatsCard";
import { OrderItemsTable } from "@/components/Dashboard/orders/shared/OrderItemsTable";
import { PayCreditModal } from "@/components/Customer/credit/PayCreditModal";
import { useMyCredit } from "@/service/myData/myData.query";
import { useBankIconNames } from "@/service/nameList/nameList.queries";

export default function CustomerCreditDetailPage() {
  const { creditId } = useParams<{ creditId: string }>();
  const navigate = useNavigate();

  const {
    data: credit,
    isLoading,
    error,
  } = useMyCredit(creditId ? decodeURIComponent(creditId) : undefined);
  const { data: payments = [] } = useCreditPayments(credit?.id);
  const { data: pendingPayment } = useCreditPendingPayments(credit?.id);
  const { data: items = [] } = useOrderItems(credit?.orderId);
  const { data: banks = [] } = useBankIconNames();
  const addPayment = useAddCreditPayment();

  const [payOpen, setPayOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BankIconList | null>(null);
  const [payMethod, setPayMethod] = useState<keyof typeof PayMethod>("0");
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
console.log(pendingPayment)
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <PageError
          message={error.message}
          onBack={() => navigate("/customer/dashboard")}
          backLabel="Back to Dashboard"
        />
      </div>
    );
  }

  if (isLoading || !credit) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <DetailPageSkeleton />
        </div>
      </div>
    );
  }

  const remain = parseMoney(credit.remain);
  const total = parseMoney(credit.total);
  const paid = parseMoney(credit.paid);
  const isPaid = credit.status === "Paid";
  const payPer =
    total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;

  const submitPayment = async () => {
    const value = parseFloat(amount);
    if (!selectedBank) {
      toast.error("Select a bank account");
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (value > remain) {
      toast.error("Amount is greater than the remaining balance");
      return;
    }
    if (!receipt) {
      toast.error("A payment receipt is required");
      return;
    }

    try {
      const message = await addPayment.mutateAsync({
        creditId: credit.id,
        bankId: selectedBank.id,
        payMethod,
        amount: value,
        receipt,
      });
      toast.success(message ?? "Payment submitted — pending review");
      setPayOpen(false);
      setSelectedBank(null);
      setAmount("");
      setReceipt(null);
      setPayMethod("0");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit payment");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-5">
        <button
          onClick={() => navigate("/customer/dashboard")}
          className="flex items-center gap-1.5 text-sm text-brown-500 hover:text-brown-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-brown-900">
                Credit {credit.code}
              </h1>
              <Badge className={getCreditStatusColor(credit.status)}>
                {credit.status}
              </Badge>
            </div>
            <p className="text-sm text-brown-400 mt-0.5">
              Order {credit.orderCode}
            </p>
          </div>
          {!isPaid && remain > 0 && (
            <Button
              onClick={() => {
                setAmount(remain.toFixed(2));
                setPayOpen(true);
              }}
              className="bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-semibold"
            >
              <Wallet className="h-4 w-4 mr-2" /> Pay Now
            </Button>
          )}
        </div>

        <CreditStatsCard
          total={total}
          paid={paid}
          remain={remain}
          payPer={payPer}
          appDate={fmtDate(credit.appDate)}
          dueDate={fmtDate(credit.dueDate)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          {/* Order items */}
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

          {/* Payments sidebar */}
          <Card className={`p-5 h-fit ${pendingPayment ? "border-yellow-200" : ""}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-brown-400" />
                <p className="text-sm font-semibold text-brown-800">Payments</p>
              </div>
              {pendingPayment && (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs shrink-0">
                  Action needed
                </Badge>
              )}
            </div>

            {pendingPayment ? (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-brown-900">
                    {pendingPayment.amount}
                  </p>
                  <Badge className={`${getCrdtPayStatusColor(pendingPayment.status)} text-xs shrink-0`}>
                    {pendingPayment.status}
                  </Badge>
                </div>
                <p className="text-xs text-brown-500 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="inline-flex items-center gap-1">
                    <Landmark className="h-3 w-3" /> {pendingPayment.bank}
                  </span>
                  <span>·</span>
                  <span>{pendingPayment.payMethod}</span>
                  <span>·</span>
                  <span>{pendingPayment.payDate?.split("T")[0]}</span>
                </p>
                <p className="text-xs text-brown-400 flex items-center gap-1.5">
                  <Receipt className="h-3.5 w-3.5 shrink-0 text-yellow-600" />
                  Awaiting review by our team.
                </p>
              </div>
            ) : (
              <p className="text-xs text-brown-400 mt-1 mb-3">
                {payments.length} payment{payments.length !== 1 ? "s" : ""}{" "}
                submitted for this credit.
              </p>
            )}

            <Button
              variant="outline"
              onClick={() =>
                navigate(
                  `/customer/credits/${encodeURIComponent(credit.id)}/payments`,
                )
              }
              className="w-full mt-4 border-brown-300 text-brown-700 hover:bg-yellow-50"
            >
              <History className="h-4 w-4 mr-2" /> Payment History
            </Button>
          </Card>
        </div>
      </div>

      <PayCreditModal
        open={payOpen}
        onOpenChange={setPayOpen}
        remain={remain}
        banks={banks}
        selectedBank={selectedBank}
        onSelectBank={setSelectedBank}
        payMethod={payMethod}
        onPayMethodChange={setPayMethod}
        amount={amount}
        onAmountChange={setAmount}
        receipt={receipt}
        onReceiptChange={setReceipt}
        submitting={addPayment.isPending}
        onSubmit={submitPayment}
      />
    </div>
  );
}
