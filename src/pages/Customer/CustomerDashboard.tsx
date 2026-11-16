import { useNavigate } from "react-router-dom";
import Header from "@/components/shared/Header";
import { Button } from "@/components/shared/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shared/ui/tabs";
import { Badge } from "@/components/shared/ui/badge";
import { Package, CreditCard, ArrowLeft } from "lucide-react";
import { TablePageSkeleton } from "@/components/shared/PageSkeleton";
import { PageError } from "@/components/shared/PageError";
import { cn } from "@/lib/utils";
import { parseMoney } from "@/lib/format";
import { DashboardStats } from "@/components/Customer/dashboard/DashboardStats";
import { OrdersTab } from "@/components/Customer/dashboard/OrdersTab";
import { CreditTab } from "@/components/Customer/dashboard/CreditTab";
import { useMyCredits, useMyOrders } from "@/service/myData/myData.query";

export default function CustomerDashboard() {
  const navigate = useNavigate();

 const {
  data: orders = [],
  isLoading: ordersLoading,
  error: ordersError,
} = useMyOrders();

const {
  data: credits = [],
  isLoading: creditsLoading,
  error: creditsError,
} = useMyCredits();

const paidCredits = credits.filter((c) => c.status === "Paid");
const unpaidCredits = credits.filter((c) => c.status !== "Paid");
const sortedCredits = [...unpaidCredits, ...paidCredits];

    const loading = ordersLoading || creditsLoading;
  const error = ordersError || creditsError;

  // Credit "amount" = remaining balance
  const totalCredit = sortedCredits.reduce((sum, c) => sum + parseMoney(c.remain), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-brown-700 hover:text-brown-900 hover:bg-brown-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
          <p className="text-slate-500 mt-1">
            View your orders and credit balance
          </p>
        </div>

        {error ? (
          <PageError message={error.message} />
        ) : loading ? (
          <TablePageSkeleton rows={5} />
        ) : (
          <>
            <DashboardStats orders={orders} credits={credits} />

            <Tabs defaultValue="orders" className="space-y-5">
              <TabsList className="h-11 w-fit rounded-lg border border-slate-200 bg-slate-100 p-0 gap-0 shadow-sm">
                <TabsTrigger
                  value="orders"
                  className={cn(
                    "h-9 rounded-lg px-5 text-sm font-medium text-slate-600 transition-all",
                    "hover:text-slate-900",
                    "data-[state=active]:bg-yellow-500 data-[state=active]:text-brown-900 data-[state=active]:shadow-none",
                  )}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                  <Badge className="ml-2 px-2 py-0 text-xs bg-yellow-100 text-yellow-800">
                    {orders.length}
                  </Badge>
                </TabsTrigger>

                <TabsTrigger
                  value="credit"
                  className={cn(
                    "h-9 rounded-lg px-5 text-sm font-medium text-slate-600 transition-all",
                    "hover:text-slate-900",
                    "data-[state=active]:bg-yellow-500 data-[state=active]:text-brown-900 data-[state=active]:shadow-none",
                  )}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Credits
                  <Badge className="ml-2 px-2 py-0 text-xs bg-yellow-100 text-yellow-800">
                    {credits.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="orders"
                className="mt-0 focus-visible:outline-none"
              >
                <OrdersTab orders={orders} />
              </TabsContent>

              <TabsContent
                value="credit"
                className="mt-0 focus-visible:outline-none"
              >
                <CreditTab credits={credits} totalCredit={totalCredit} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
