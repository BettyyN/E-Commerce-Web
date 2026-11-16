import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Card } from "@/components/shared/ui/card";
import {
  ArrowLeft,
  Phone,
  Mail,
  User,
  ShoppingBag,
  CreditCard,
  Clock,
  MessageSquareText,
  Landmark,
  FileText,
} from "lucide-react";
import { DetailPageSkeleton } from "@/components/shared/PageSkeleton";
import { PageError } from "@/components/shared/PageError";
import { useOrder } from "@/service/order/order.queries";
import { useOrderItems } from "@/service/orderItem/orderItem.queries";
import {
  useCreditsPaid,
  useCreditsUnpaid,
} from "@/service/credit/credit.queries";
import { useCreditPayments } from "@/service/pay/pay.queries";
import { GenerateReceiptModal } from "@/components/Dashboard/orders/sales/GenerateReceiptModal";
import { buildReceiptOrder } from "@/lib/receiptOrder";

export default function CreditOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [generateOpen, setGenerateOpen] = useState(false);

  const {
    data: order,
    isLoading,
    error,
  } = useOrder(orderId ? decodeURIComponent(orderId) : undefined);
  const { data: items = [] } = useOrderItems(
    order ? decodeURIComponent(orderId!) : undefined,
  );

  // The credit record carries the remark — find it by order code
  const { data: creditsPaid = [] } = useCreditsPaid();
  const { data: creditsUnpaid = [] } = useCreditsUnpaid();
  const credit =
    [...creditsPaid, ...creditsUnpaid].find(
      (c) => c.orderCode === order?.code,
    ) ?? null;
  const remark = credit?.remark ?? "";

  // Credit payment history — review happens on the order detail page
  const { data: payments = [] } = useCreditPayments(credit?.id);

  if (error) {
    return (
      <DashboardLayout>
        <PageError
          message={error.message}
          onBack={() => navigate("/dashboard/credit-orders")}
          backLabel="Back to Credit Orders"
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
    unitPrice: parseFloat(i.unitPrice) || 0,
    total: parseFloat(i.total) || 0,
  }));
  const subtotal = lineRows.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const total = order.total ? parseFloat(order.total) : subtotal;

  const isPending = order.status === "Pending";

  const payBadge = (status: string) =>
    status === "Pending"
      ? "bg-yellow-100 text-yellow-800"
      : status === "Rejected"
        ? "bg-red-100 text-red-800"
        : "bg-green-100 text-green-800";

  return (
    <DashboardLayout>
      <div className="max-w-5xl space-y-4">
        {/* Top nav */}
        <button
          onClick={() => navigate("/dashboard/credit-orders")}
          className="flex items-center gap-1.5 text-sm text-brown-500 hover:text-brown-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Credit Orders
        </button>

        {/* Heading */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-brown-900">
                Credit Order {order.code}
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
              <p className="text-xs text-brown-400 mb-1">Order Status</p>
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
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-0.5">Order Date</p>
              <p className="text-sm font-semibold text-brown-900">
                {order.orderDateAt?.split("T")[0]}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-0.5">Order Total</p>
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
          </div>
        </Card>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          {/* LEFT */}
          <div className="space-y-4">
            {/* Customer */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-brown-400" />
                <p className="text-sm font-semibold text-brown-800">
                  Customer Information
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-sm shrink-0">
                  {order.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brown-900 text-sm">
                    {order.fullName}
                  </p>
                  <div className="mt-1.5 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-brown-500">
                      <Mail className="h-3 w-3 text-brown-300 shrink-0" />
                      {order.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-brown-500">
                      <Phone className="h-3 w-3 text-brown-300 shrink-0" />
                      {order.phoneNum}
                    </div>
                  </div>
                </div>
              </div>

              {/* What the customer asked the credit for */}
              {isPending && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <p className="text-xs font-medium text-brown-500 mb-1.5 flex items-center gap-1.5">
                    <MessageSquareText className="h-3 w-3" /> Customer's request
                    note
                  </p>
                  <p className="text-sm text-brown-800 leading-relaxed">
                    {remark || "The customer did not leave a note."}
                  </p>
                </div>
              )}
            </Card>

            {/* Order Items */}
            <Card className="overflow-hidden">
              <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-slate-100">
                <ShoppingBag className="h-4 w-4 text-brown-400" />
                <p className="text-sm font-semibold text-brown-800">
                  Order Items ({lineRows.length})
                </p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-brown-400">
                      Item
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-brown-400">
                      Price
                    </th>
                    <th className="text-center px-4 py-2.5 text-xs font-medium text-brown-400">
                      Qty
                    </th>
                    <th className="text-right px-5 py-2.5 text-xs font-medium text-brown-400">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lineRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-8 text-center text-sm text-brown-400"
                      >
                        No item details available
                      </td>
                    </tr>
                  )}
                  {lineRows.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-yellow-50/20 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-medium text-brown-900 text-sm">
                        {item.product}
                      </td>
                      <td className="px-4 py-3.5 text-right text-brown-500 text-sm">
                        {item.unitPrice.toLocaleString()} ETB
                      </td>
                      <td className="px-4 py-3.5 text-center text-brown-500 text-sm">
                        {item.quantity}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-brown-900 text-sm">
                        {item.total.toLocaleString()} ETB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Credit payment history */}
            <Card className="overflow-hidden">
              <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-slate-100">
                <CreditCard className="h-4 w-4 text-brown-400" />
                <p className="text-sm font-semibold text-brown-800">
                  Credit Payment History ({payments.length})
                </p>
              </div>
              {payments.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-brown-400">
                  No credit payments submitted yet
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

          {/* RIGHT */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-4 w-4 text-brown-400" />
                <p className="text-sm font-semibold text-brown-800">
                  Credit Summary
                </p>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-brown-500">
                  <span>Subtotal</span>
                  <span>
                    {order.subTotal || `${subtotal.toLocaleString()} ETB`}
                  </span>
                </div>
                <div className="flex justify-between text-brown-500">
                  <span>VAT</span>
                  <span>{order.vat || "—"}</span>
                </div>
                <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center">
                  <span className="font-semibold text-brown-900">
                    Total Amount
                  </span>
                  <span className="text-base font-bold text-yellow-600">
                    {order.total || `${total.toLocaleString()} ETB`}
                  </span>
                </div>
              </div>

              {isPending && (
                <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-3">
                  <p className="text-xs text-blue-700 font-medium mb-1 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Awaiting review
                  </p>
                  <p className="text-xs text-blue-600 leading-relaxed">
                    Credit review happens on the order page.{" "}
                    <Link
                      to={`/dashboard/orders/${encodeURIComponent(order.id)}`}
                      className="font-semibold underline underline-offset-2 hover:text-blue-800"
                    >
                      Open the order to review this request
                    </Link>
                    .
                  </p>
                </div>
              )}
              {!isPending && (
                <div
                  className={`mt-4 rounded-lg p-3 text-center text-xs font-medium ${
                    order.status === "Rejected"
                      ? "bg-red-50 text-red-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  This credit request has been {order.status.toLowerCase()}.
                </div>
              )}
              {order.status === "Approved" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGenerateOpen(true)}
                  className="w-full mt-4 border-brown-300 text-brown-700 hover:bg-yellow-50"
                >
                  <FileText className="h-3.5 w-3.5 mr-2" /> View Attachemnt
                </Button>
              )}
            </Card>

            {/* Balance tracker */}
            {credit && !isPending && (
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Landmark className="h-4 w-4 text-brown-400" />
                  <p className="text-sm font-semibold text-brown-800">
                    Balance
                  </p>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-brown-500">
                    <span>Total Credit</span>
                    <span className="font-semibold text-brown-900">
                      {credit.total}
                    </span>
                  </div>
                  <div className="flex justify-between text-brown-500">
                    <span>Paid</span>
                    <span className="font-semibold text-green-600">
                      {credit.paid}
                    </span>
                  </div>
                  <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center">
                    <span className="font-semibold text-brown-900">
                      Remaining
                    </span>
                    <span
                      className={`text-base font-bold ${
                        credit.status === "Paid"
                          ? "text-slate-400"
                          : "text-red-600"
                      }`}
                    >
                      {credit.remain}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Generated (printable) receipt — approved credit */}
      {generateOpen && (
        <GenerateReceiptModal
          open
          onClose={() => setGenerateOpen(false)}
          order={buildReceiptOrder(order, items)}
        />
      )}
    </DashboardLayout>
  );
}
