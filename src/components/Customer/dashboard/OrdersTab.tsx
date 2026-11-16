import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui/card";
import { Badge } from "@/components/shared/ui/badge";
import { Button } from "@/components/shared/ui/button";
import { Eye, Truck, CreditCard } from "lucide-react";
import { getOrderStatusColor, fmtDate } from "@/lib/format";
import { TableToolbar } from "@/components/shared/TableToolbar";
import {
  ALL_FILTER,
  toFilterOptions,
  type TableFilter,
} from "@/lib/tableFilters";
import type { MyOrdListDto } from "@/types/myOrder";

interface Props {
  orders: MyOrdListDto[];
}

export function OrdersTab({ orders }: Props) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER);

  const statusOptions = useMemo(
    () => toFilterOptions(orders.map((o) => o.status)),
    [orders],
  );
  const [creditFilter, setCreditFilter] = useState(ALL_FILTER);

  // isCreditStr comes back from the API as "Yes" / "No"
  const IS_CREDIT_OPTIONS = [
    { label: "Credit Orders", value: "yes" },
    { label: "Non-Credit Orders", value: "no" },
  ];

  const filters: TableFilter[] = useMemo(
    () => [
      {
        value: statusFilter,
        onChange: setStatusFilter,
        allLabel: "All statuses",
        options: statusOptions,
      },
      {
        value: creditFilter,
        onChange: setCreditFilter,
        allLabel: "All Order Types",
        options: IS_CREDIT_OPTIONS,
      },
    ],
    [statusFilter, creditFilter, statusOptions],
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
        (order.status ?? "").toLowerCase().includes(q) ||
        (order.amount ?? "").toLowerCase().includes(q) ||
        (order.isCreditStr ?? "").toLowerCase().includes(q) ||
        (order.hasShipping ?? "").toLowerCase().includes(q) ||
        (order.orderAt ?? "").toLowerCase().includes(q) ||
        fmtDate(order.orderAt).toLowerCase().includes(q)
      );
    });
  }, [orders, searchQuery, statusFilter, creditFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== ALL_FILTER ||
    creditFilter !== ALL_FILTER;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-col gap-4 pb-3">
        <CardTitle className="text-lg font-semibold">
          Order History
        </CardTitle>
        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search orders..."
          filters={filters}
          filterClassName="border-slate-200 text-slate-700"
        />
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b bg-slate-50/70">
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Shipping
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Credit
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-sm text-slate-400"
                  >
                    {hasActiveFilters
                      ? "No orders match your search or filters."
                      : "You haven't placed any orders yet."}
                  </td>
                </tr>
              )}
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {order.code ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {fmtDate(order.orderAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                      <Truck className="h-3.5 w-3.5 text-slate-400" />
                      {order.hasShipping ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                      <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                      {order.isCreditStr ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {order.amount ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={getOrderStatusColor(order.status ?? "—")}
                    >
                      {order.status ?? "—"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/customer/orders/${order.id}`)}
                      className="border-slate-200 text-slate-700 hover:bg-yellow-50 gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
