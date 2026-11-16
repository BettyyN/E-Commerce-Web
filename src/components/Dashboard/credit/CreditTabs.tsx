import { useMemo, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shared/ui/tabs";
import { Badge } from "@/components/shared/ui/badge";
import { cn } from "@/lib/utils";
import {  AlertCircle, CheckCircle2 } from "lucide-react";
import {
  useCreditsPaid,
  useCreditsUnpaid,
} from "@/service/credit/credit.queries";
import { CreditTable } from "@/components/Dashboard/credit/CreditTable";

const TAB_CLASSES = cn(
  "h-9 rounded-lg px-5 text-sm font-medium text-brown-700 transition-all",
  "hover:text-brown-900",
  "data-[state=active]:bg-yellow-500 data-[state=active]:text-brown-900 data-[state=active]:shadow-none",
);

interface CreditTabsProps {
  searchQuery?: string;
  statusFilter?: string;
}

export function CreditTabs({
  searchQuery = "",
  statusFilter = "all",
}: CreditTabsProps) {
  const {
    data: unpaidCredits = [],
    isLoading: unpaidLoading,
    error: unpaidError,
  } = useCreditsUnpaid();
  const {
    data: paidCredits = [],
    isLoading: paidLoading,
    error: paidError,
  } = useCreditsPaid();

  const [activeTab, setActiveTab] = useState("unpaid");

  const allCredits = useMemo(
    () => [...unpaidCredits, ...paidCredits],
    [unpaidCredits, paidCredits],
  );

  const error = unpaidError ?? paidError;

  if (error) {
    return (
      <div className="p-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
        Failed to load credits: {error.message}
      </div>
    );
  }

  const isLoading = unpaidLoading || paidLoading;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
      <TabsList className="h-11 w-fit rounded-lg border border-slate-200 bg-slate-100 p-0 gap-0 shadow-sm">
        <TabsTrigger value="unpaid" className={TAB_CLASSES}>
          <AlertCircle className="mr-2 h-4 w-4" />
          Unpaid
          <Badge className="ml-2 px-2 py-0 text-xs bg-red-100 text-red-800">
            {unpaidLoading ? "…" : unpaidCredits.length}
          </Badge>
        </TabsTrigger>

        <TabsTrigger value="paid" className={TAB_CLASSES}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Paid
          <Badge className="ml-2 px-2 py-0 text-xs bg-green-100 text-green-800">
            {paidLoading ? "…" : paidCredits.length}
          </Badge>
        </TabsTrigger>

      </TabsList>

      <TabsContent value="unpaid" className="mt-0 focus-visible:outline-none">
        <CreditTable
          credits={unpaidCredits}
          isLoading={unpaidLoading}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          title="Unpaid Credits"
          subtitle="Outstanding balances — follow up with customers to settle"
          emptyMessage="No unpaid credits"
          loadingMessage="Loading unpaid credits…"
        />
      </TabsContent>

      <TabsContent value="paid" className="mt-0 focus-visible:outline-none">
        <CreditTable
          credits={paidCredits}
          isLoading={paidLoading}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          title="Paid Credits"
          subtitle="Fully settled credit orders"
          emptyMessage="No paid credits"
          loadingMessage="Loading paid credits…"
        />
      </TabsContent>

      <TabsContent value="all" className="mt-0 focus-visible:outline-none">
        <CreditTable
          credits={allCredits}
          isLoading={isLoading}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          title="All Credits"
          subtitle="Unpaid first, then settled credits"
          emptyMessage="No credit records"
        />
      </TabsContent>
    </Tabs>
  );
}
