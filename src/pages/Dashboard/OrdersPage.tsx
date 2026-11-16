import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import { OrdersTabs } from "@/components/Dashboard/orders/OrdersTabs";
import { OrdersHeader } from "@/components/Dashboard/orders/OrdersHeader";
import { useOrders } from "@/service/order/order.queries";
import {
  ALL_FILTER,
  toFilterOptions,
  type TableFilter,
} from "@/lib/tableFilters";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER);
 const [creditFilter, setCreditFilter] = useState(ALL_FILTER);

  const { data: allOrders = [] } = useOrders();

  const statusOptions = useMemo(
    () => toFilterOptions(allOrders.map((o) => o.status)),
    [allOrders],
  );
 const IS_CREDIT_OPTIONS = [
   { label: "Credit orders", value: "yes" },
   { label: "Non-credit orders", value: "no" },
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
        allLabel: "All credits",
        options: IS_CREDIT_OPTIONS,
      },
    ],
    [statusFilter, creditFilter, statusOptions, IS_CREDIT_OPTIONS],
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <OrdersHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
        />
        <OrdersTabs
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          creditFilter={creditFilter}
        />
      </div>
    </DashboardLayout>
  );
}
