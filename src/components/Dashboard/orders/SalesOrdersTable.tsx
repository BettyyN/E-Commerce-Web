import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Pagination } from "@/components/shared/ui/pagination";
import { Eye } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fmtDate } from "@/lib/format";
import { ALL_FILTER, useResettablePage } from "@/lib/tableFilters";
import type { OrderListDto } from "@/types/order";

const ITEMS_PER_PAGE = 5;

interface SalesOrdersTableProps {
  orders: OrderListDto[];
  isLoading?: boolean;
  searchQuery?: string;
  statusFilter?: string;
  creditFilter?: string;
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  loadingMessage?: string;
}

export function SalesOrdersTable({
  orders,
  isLoading = false,
  searchQuery = "",
  statusFilter = ALL_FILTER,
  creditFilter = ALL_FILTER,
  title = "Orders",
  subtitle = "All orders — open one to review its payment or credit request",
  emptyMessage = "No orders yet",
  loadingMessage = "Loading orders…",
}: SalesOrdersTableProps) {
  const navigate = useNavigate();
  // Pagination resets to page 1 whenever the search or a filter changes.
  const [currentPage, setCurrentPage] = useResettablePage(
    `${searchQuery.trim()}|${statusFilter}|${creditFilter}`,
  );

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orders.filter((order) => {
      if (
        statusFilter !== ALL_FILTER &&
        (order.status ?? "").toLowerCase() !== statusFilter
      ) {
        return false;
      }
      if (
        creditFilter !== ALL_FILTER &&
        (order.isCreditStr ?? "").toLowerCase() !== creditFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        (order.code ?? "").toLowerCase().includes(q) ||
        (order.customer ?? "").toLowerCase().includes(q) ||
        (order.amount ?? "").toLowerCase().includes(q) ||
        (order.status ?? "").toLowerCase().includes(q) ||
        (order.isCreditStr ?? "").toLowerCase().includes(q) ||
        (order.orderDateAt ?? "").toLowerCase().includes(q) ||
        fmtDate(order.orderDateAt).toLowerCase().includes(q)
      );
    });
  }, [orders, searchQuery, statusFilter, creditFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== ALL_FILTER ||
    creditFilter !== ALL_FILTER;

  const totalPages = Math.max(
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE),
    1,
  );
  const safePage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, safePage]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "verified":
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "delivered":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) {
    return (
      <Card className="p-10 text-center text-brown-500">{loadingMessage}</Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-brown-900">
          {title}
          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 font-semibold px-1.5 py-0.5 rounded-full align-middle">
            {filteredOrders.length}
          </span>
        </h2>
        <p className="text-xs text-brown-500">{subtitle}</p>
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
                Shipping
              </th>
              <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                Is Credit
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
            {paginatedOrders.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 px-4 text-center text-sm text-slate-400"
                >
                  {hasActiveFilters
                    ? "No orders match your search or filters"
                    : emptyMessage}
                </td>
              </tr>
            )}
            {paginatedOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-brown-100 hover:bg-brown-50"
              >
                <td className="py-3 px-4 text-brown-900 font-medium">
                  {order.code}
                </td>
                <td className="py-3 px-4 text-brown-700">{order.customer}</td>
                <td className="py-3 px-4 text-brown-900">{order.amount}</td>
                <td className="py-3 px-4 text-brown-600">
                  {order.hasShipping}
                </td>
                <td className="py-3 px-4">
                  {/* isCreditStr: "Credit" | "Paid" */}
                  <Badge
                    className={
                      order.isCreditStr === "Credit"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-emerald-100 text-emerald-800"
                    }
                  >
                    {order.isCreditStr}
                  </Badge>
                </td>
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
                          `/dashboard/orders/${encodeURIComponent(order.id)}`,
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
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={filteredOrders.length}
      />
    </Card>
  );
}
