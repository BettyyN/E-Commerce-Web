import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shared/ui/tabs";
import { Badge } from "@/components/shared/ui/badge";
import { cn } from "@/lib/utils";
import { ShoppingBag, Clock } from "lucide-react";
import { useOrders, usePendingOrders } from "@/service/order/order.queries";
import { SalesOrdersTable } from "./SalesOrdersTable";

const TAB_CLASSES = cn(
  "h-9 rounded-lg px-5 text-sm font-medium text-brown-700 transition-all",
  "hover:text-brown-900",
  "data-[state=active]:bg-yellow-500 data-[state=active]:text-brown-900 data-[state=active]:shadow-none",
);

interface OrdersTabsProps {
  searchQuery?: string;
  statusFilter?: string;
  creditFilter?: string;
}

export function OrdersTabs({
  searchQuery = "",
  statusFilter = "all",
  creditFilter = "all",
}: OrdersTabsProps) {
  const {
    data: allOrders = [],
    isLoading: allLoading,
    error: allError,
  } = useOrders();
  const {
    data: pendingOrders = [],
    isLoading: pendingLoading,
    error: pendingError,
  } = usePendingOrders();

  const [activeTab, setActiveTab] = useState("all");

  // If pending orders arrive but the current tab shows an empty list, jump to Pending
  useEffect(() => {
    if (activeTab === "all" && !allLoading && allOrders.length === 0 && pendingOrders.length > 0) {
      setActiveTab("pending");
    }
  }, [activeTab, allLoading, allOrders.length, pendingOrders.length]);

  const error = allError ?? pendingError;

  if (error) {
    return (
      <div className="p-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
        Failed to load orders: {error.message}
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
      <TabsList className="h-11 w-fit rounded-lg border border-slate-200 bg-slate-100 p-0 gap-0 shadow-sm">
        <TabsTrigger value="pending" className={TAB_CLASSES}>
          <Clock className="mr-2 h-4 w-4" />
          Pending
          <Badge className="ml-2 px-2 py-0 text-xs bg-yellow-100 text-yellow-800">
            {pendingLoading ? "…" : pendingOrders.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="all" className={TAB_CLASSES}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          All Orders
          <Badge className="ml-2 px-2 py-0 text-xs bg-yellow-100 text-yellow-800">
            {allLoading ? "…" : allOrders.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-0 focus-visible:outline-none">
        <SalesOrdersTable
          orders={allOrders}
          isLoading={allLoading}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          creditFilter={creditFilter}
          title="All Orders"
          subtitle="Every order — open one to review its payment or credit request"
          emptyMessage="No orders yet"
        />
      </TabsContent>

      <TabsContent value="pending" className="mt-0 focus-visible:outline-none">
        <SalesOrdersTable
          orders={pendingOrders}
          isLoading={pendingLoading}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          creditFilter={creditFilter}
          title="Pending Orders"
          subtitle="Orders awaiting review — verify payment or decide credit requests"
          emptyMessage="No pending orders"
          loadingMessage="Loading pending orders…"
        />
      </TabsContent>
    </Tabs>
  );
}
