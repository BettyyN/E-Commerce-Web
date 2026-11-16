import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Pagination } from "@/components/shared/ui/pagination";
import { Eye } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "@/store/orderStore";

const ITEMS_PER_PAGE = 5;

export function StoreOrdersTable() {
  const { orders } = useOrderStore();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const verifiedOrders = useMemo(
    () => orders.filter((o) => o.paymentStatus === "verified"),
    [orders],
  );

  const totalPages = Math.ceil(verifiedOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return verifiedOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [verifiedOrders, currentPage]);

  const getOrderBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "payment_verified":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (s: string) =>
    s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (verifiedOrders.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-12 text-brown-500">
          No verified orders yet. Orders appear here after sales verifies the
          payment.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brown-200">
              <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                Order ID
              </th>
              <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                Items
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
              <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-brown-100 hover:bg-brown-50"
              >
                <td className="py-3 px-4 text-brown-900 font-medium">
                  {order.id}
                </td>
                <td className="py-3 px-4 text-brown-700">{order.customer}</td>
                <td className="py-3 px-4 text-brown-700">{order.items}</td>
                <td className="py-3 px-4 text-brown-900">{order.amount}</td>
                <td className="py-3 px-4">
                  <Badge className={getOrderBadge(order.orderStatus)}>
                    {formatStatus(order.orderStatus)}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-brown-600">{order.date}</td>
                <td className="py-3 px-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(
                        `/dashboard/store-orders/${encodeURIComponent(order.id)}`,
                      )
                    }
                    className="border-brown-300 text-brown-700 hover:bg-yellow-50 gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" /> View Details
                  </Button>
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
        totalItems={verifiedOrders.length}
      />
    </Card>
  );
}
