import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/shared/Header";
import { Badge } from "@/components/shared/ui/badge";
import { Card } from "@/components/shared/ui/card";
import { ArrowLeft } from "lucide-react";
import { DetailPageSkeleton } from "@/components/shared/PageSkeleton";
import { PageError } from "@/components/shared/PageError";
import {  useDeleteOrder } from "@/service/order/order.queries";
import { useOrderItems } from "@/service/orderItem/orderItem.queries";
import { useOrderPayment } from "@/service/pay/pay.queries";
import {
  getOrderStatusColor,
  getPaymentStatusColor,
  fmtDate,
  parseMoney,
} from "@/lib/format";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { toast } from "sonner";
import { OrderSummaryCard } from "@/components/Customer/orders/OrderSummaryCard";
import { OrderItemsTable } from "@/components/Dashboard/orders/shared/OrderItemsTable";
import { useMyOrder } from "@/service/myData/myData.query";

export default function CustomerOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [cancelOpen, setCancelOpen] = useState(false);

  const {
    data: order,
    isLoading,
    error,
  } = useMyOrder(orderId ? decodeURIComponent(orderId) : undefined);
  const { data: items = [] } = useOrderItems(order?.id);
  const { data: payment } = useOrderPayment(order?.id);
  const deleteOrder = useDeleteOrder();

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

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <DetailPageSkeleton />
        </div>
      </div>
    );
  }

  const total = parseMoney(order.total);
  const subTotal = parseMoney(order.subTotal);
  const vat = parseMoney(order.vat);
  const paymentLabel = order.isCredit
    ? "Credit"
    : (payment?.status ?? "Pending");


  const handleCancel = async () => {
    try {
      const message = await deleteOrder.mutateAsync(order.id);
      toast.success(message ?? "Order cancelled");
      navigate("/customer/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel order");
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
                Order {order.code}
              </h1>
              <Badge className={getOrderStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-brown-400 mt-0.5">
              Placed on {fmtDate(order.orderDateAt)}
            </p>
          </div>
          {/* {canCancel && (
            <Button
              variant="outline"
              onClick={() => setCancelOpen(true)}
              disabled={deleteOrder.isPending}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              {deleteOrder.isPending ? "Cancelling…" : "Cancel Order"}
            </Button>
          )} */}
        </div>

        {/* Stats bar */}
        <Card className="p-0 overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-1">Order Status</p>
              <Badge className={getOrderStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-1">Payment Status</p>
              <Badge className={getPaymentStatusColor(paymentLabel)}>
                {paymentLabel}
              </Badge>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-0.5">Order Date</p>
              <p className="text-sm font-semibold text-brown-900">
                {fmtDate(order.orderDateAt)}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-0.5">Order Total</p>
              <p className="text-lg font-bold text-yellow-600">{order.total}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
          {/* Items table — shared table includes the VAT column */}
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

          <OrderSummaryCard
            subTotal={subTotal}
            vat={vat}
            total={total}
            orderDate={fmtDate(order.orderDateAt)}
            paymentLabel={paymentLabel}
            payment={payment ?? undefined}
            isCredit={order.isCredit}
          />
        </div>
      </div>

      <DeleteConfirmationModal
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel Order"
        description={`Are you sure you want to cancel order ${order.code}? This cannot be undone.`}
        confirmLabel="Cancel Order"
        onConfirm={handleCancel}
      />
    </div>
  );
}
