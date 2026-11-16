import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Pagination } from "@/components/shared/ui/pagination";
import { Eye } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/service/order/order.queries";

const ITEMS_PER_PAGE = 5;

export function CreditOrdersTable() {
  const { data: orders = [], isLoading } = useOrders();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Only credit orders, newest handling at the top
  const creditOrders = useMemo(
    () => orders.filter((o) => o.isCreditStr === "Credit"),
    [orders],
  );

  const totalPages = Math.ceil(creditOrders.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return creditOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [creditOrders, currentPage]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) {
    return (
      <Card className="p-10 text-center text-brown-500">
        Loading credit orders…
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-brown-900">
          Credit Orders
          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 font-semibold px-1.5 py-0.5 rounded-full align-middle">
            {creditOrders.length}
          </span>
        </h2>
        <p className="text-xs text-brown-500">
          Open an order to review the request and approve or decline
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brown-200">
              <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                Order Code
              </th>
              <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                Status
              </th>
              <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                Date
              </th>
              <th className="text-right py-3 px-4 text-brown-700 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 px-4 text-center text-sm text-slate-400"
                >
                  No credit orders
                </td>
              </tr>
            )}
            {paginated.map((order) => (
              <tr
                key={order.id}
                className="border-b border-brown-100 hover:bg-brown-50"
              >
                <td className="py-3 px-4 text-brown-900 font-medium">
                  {order.code}
                </td>
                <td className="py-3 px-4 text-brown-700">{order.customer}</td>
                <td className="py-3 px-4 text-brown-900">{order.amount}</td>
                <td className="py-3 px-4">
                  <Badge className={getStatusBadge(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-brown-600">
                  {order.orderDateAt?.split("T")[0]}
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/dashboard/credit-orders/${encodeURIComponent(order.id)}`,
                        )
                      }
                      className="border-brown-300 text-brown-700 hover:bg-yellow-50 gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={creditOrders.length}
      />
    </Card>
  );
}
