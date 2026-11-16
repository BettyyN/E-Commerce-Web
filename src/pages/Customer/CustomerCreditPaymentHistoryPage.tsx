import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/shared/Header";
import { ArrowLeft, CreditCard } from "lucide-react";
import { DetailPageSkeleton } from "@/components/shared/PageSkeleton";
import { PageError } from "@/components/shared/PageError";
import { useCreditPayments } from "@/service/pay/pay.queries";
import { useMyCredit } from "@/service/myData/myData.query";
import { PaymentHistoryTable } from "@/components/Customer/credit/PaymentHistoryTable";

export default function CustomerCreditPaymentHistoryPage() {
  const { creditId } = useParams<{ creditId: string }>();
  const navigate = useNavigate();

  const {
    data: credit,
    isLoading,
    error,
  } = useMyCredit(creditId ? decodeURIComponent(creditId) : undefined);
  const { data: payments = [] } = useCreditPayments(credit?.id);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-5">
        <button
          onClick={() =>
            navigate(`/customer/credits/${encodeURIComponent(credit.id)}`)
          }
          className="flex items-center gap-1.5 text-sm text-brown-500 hover:text-brown-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Credit Detail
        </button>

        <div>
          <h1 className="text-2xl font-bold text-brown-900 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-yellow-600" />
            Payment History
          </h1>
          <p className="text-sm text-brown-500 mt-0.5">
            Credit {credit.code} · {payments.length} payment
            {payments.length !== 1 ? "s" : ""}
          </p>
        </div>

        <PaymentHistoryTable payments={payments} />
      </div>
    </div>
  );
}
