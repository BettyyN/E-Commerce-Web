import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Card } from "@/components/shared/ui/card";
import { useOrderStore } from "@/store/orderStore";
import {
  ArrowLeft,
  Phone,
  Mail,
  Loader2,
  PackageCheck,
  User,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import type { OrderStatus } from "@/store/orderStore";

export default function StoreOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrderStore();

  const order = orders.find((o) => o.id === decodeURIComponent(orderId ?? ""));

  const [statusModal, setStatusModal] = useState(false);
  const [statusChoice, setStatusChoice] = useState<"processing" | "completed">(
    "processing",
  );

  if (!order) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-brown-600">Order not found.</p>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/store-orders")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Store Orders
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const orderItems = order.orderItems ?? [];
  const subtotal = orderItems.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  const getOrderBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "payment_verified":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "processing":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const formatStatus = (s: string) =>
    s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const handleStatusConfirm = () => {
    updateOrderStatus(order.id, statusChoice as OrderStatus);
    setStatusModal(false);
  };

  const openStatusModal = () => {
    setStatusChoice(
      order.orderStatus === "processing" ? "completed" : "processing",
    );
    setStatusModal(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl space-y-4">
        {/* ── Top nav ── */}
        <button
          onClick={() => navigate("/dashboard/store-orders")}
          className="flex items-center gap-1.5 text-sm text-brown-500 hover:text-brown-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Store Orders
        </button>

        {/* ── Page heading ── */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-brown-900">
                Order {order.id}
              </h1>
              <Badge className={`${getOrderBadge(order.orderStatus)} text-xs`}>
                {formatStatus(order.orderStatus)}
              </Badge>
            </div>
            <p className="text-sm text-brown-400 mt-0.5">
              Placed on {order.date}
            </p>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <Card className="p-0 overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-1">Order Status</p>
              <Badge className={`${getOrderBadge(order.orderStatus)} text-xs`}>
                {formatStatus(order.orderStatus)}
              </Badge>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-1">Payment Status</p>
              <Badge className="bg-green-100 text-green-700 text-xs">
                Verified
              </Badge>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-0.5">Order Date</p>
              <p className="text-sm font-semibold text-brown-900">
                {order.date}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-brown-400 mb-0.5">Order Total</p>
              <p className="text-lg font-bold text-yellow-600">
                {total.toLocaleString()} ETB
              </p>
            </div>
          </div>
        </Card>

        {/* ── Main two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          {/* LEFT */}
          <div className="space-y-4">
            {/* Customer Information */}
            <Card className="p-5">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-brown-400" />
                <p className="text-sm font-semibold text-brown-800">
                  Customer Information
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-sm shrink-0">
                  {order.customer
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brown-900 text-sm">
                    {order.customer}
                  </p>
                  <div className="mt-1.5 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-brown-500">
                      <Mail className="h-3 w-3 text-brown-300 shrink-0" />
                      {order.customerEmail}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-brown-500">
                      <Phone className="h-3 w-3 text-brown-300 shrink-0" />
                      {order.customerPhone}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Order Items */}
            <Card className="overflow-hidden">
              <div className="flex items-center gap-2 px-5 pb-3 border-b border-slate-100">
                <ShoppingBag className="h-4 w-4 text-brown-400" />
                <p className="text-sm font-semibold text-brown-800">
                  Order Items ({order.items})
                </p>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
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
                  {orderItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-8 text-center text-sm text-brown-400"
                      >
                        No item details available
                      </td>
                    </tr>
                  ) : (
                    orderItems.map((item, i) => (
                      <tr
                        key={i}
                        className="hover:bg-yellow-50/20 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-brown-900 text-sm">
                            {item.name}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-right text-brown-500 text-sm">
                          {item.unitPrice.toLocaleString()} ETB
                        </td>
                        <td className="px-4 py-3.5 text-center text-brown-500 text-sm">
                          {item.qty}
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-brown-900 text-sm">
                          {(item.qty * item.unitPrice).toLocaleString()} ETB
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          </div>

          {/* RIGHT — Summary + Actions */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-brown-400" />
                <p className="text-sm font-semibold text-brown-800">
                  Payment Summary
                </p>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-brown-500">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-brown-500">
                  <span>Tax (8%)</span>
                  <span>{tax.toLocaleString()} ETB</span>
                </div>
                {order.bank && (
                  <div className="flex justify-between text-brown-500">
                    <span>Bank</span>
                    <span className="text-right max-w-[160px] text-brown-700 font-medium">
                      {order.bank}
                    </span>
                  </div>
                )}
                <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center">
                  <span className="font-semibold text-brown-900">
                    Total Amount
                  </span>
                  <span className="text-base font-bold text-yellow-600">
                    {total.toLocaleString()} ETB
                  </span>
                </div>
              </div>

              {/* Payment status row */}
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
                <span className="text-xs font-medium text-brown-500">
                  Payment Status
                </span>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  Verified
                </Badge>
              </div>

              {/* Action */}
              <div className=" space-y-2">
                {order.orderStatus !== "completed" ? (
                  <Button
                    onClick={openStatusModal}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-semibold text-sm"
                  >
                    <PackageCheck className="h-4 w-4 mr-2" /> Change Status
                  </Button>
                ) : (
                  <div className="rounded-lg p-3 text-center text-xs font-medium bg-green-50 text-green-700">
                    Order Completed
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-base font-semibold text-brown-900 mb-1">
              Update Order Status
            </h3>
            <p className="text-sm text-brown-400 mb-5">
              Order{" "}
              <span className="font-medium text-brown-700">{order.id}</span> —
              choose the new status.
            </p>
            <div className="space-y-2.5 mb-5">
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  statusChoice === "processing"
                    ? "border-purple-400 bg-purple-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="sc"
                  value="processing"
                  checked={statusChoice === "processing"}
                  onChange={() => setStatusChoice("processing")}
                  className="accent-purple-500"
                />
                <Loader2 className="h-4 w-4 text-purple-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-brown-900">
                    In Progress
                  </p>
                  <p className="text-xs text-brown-400">
                    Order is being prepared
                  </p>
                </div>
              </label>
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  statusChoice === "completed"
                    ? "border-green-400 bg-green-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="sc"
                  value="completed"
                  checked={statusChoice === "completed"}
                  onChange={() => setStatusChoice("completed")}
                  className="accent-green-500"
                />
                <PackageCheck className="h-4 w-4 text-green-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-brown-900">
                    Completed
                  </p>
                  <p className="text-xs text-brown-400">
                    Order fulfilled and dispatched
                  </p>
                </div>
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setStatusModal(false)}
                className="border-brown-300 text-brown-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStatusConfirm}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
