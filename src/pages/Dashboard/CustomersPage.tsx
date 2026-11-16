import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shared/ui/tabs";
import { Card } from "@/components/shared/ui/card";
import { AccountsTab } from "@/components/shared/AccountsTab";
import { CustomersHeader } from "@/components/Dashboard/customers/CustomersHeader";
import { CustomersTable } from "@/components/Dashboard/customers/CustomersTable";
import { customerStatusLabel } from "@/lib/format";
import { AddCustomerModal } from "@/components/Dashboard/customers/AddCustomerModal";
import { Users, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCustomers } from "@/service/customer/customer.queries";
import { TablePageSkeleton } from "@/components/shared/PageSkeleton";
import {
  ALL_FILTER,
  toFilterOptions,
  type TableFilter,
} from "@/lib/tableFilters";

const TAB_TRIGGER_CLASS =
  "h-9 rounded-md px-5 text-sm font-medium text-slate-600 transition-all hover:text-slate-900 data-[state=active]:bg-yellow-500 data-[state=active]:text-brown-900 data-[state=active]:shadow-none";

export default function CustomersPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER);

  const { data: customers = [], isLoading } = useCustomers();

  const statusOptions = useMemo(
    () => toFilterOptions(customers.map(customerStatusLabel)),
    [customers],
  );

  const filters: TableFilter[] = useMemo(
    () => [
      {
        value: statusFilter,
        onChange: setStatusFilter,
        allLabel: "All statuses",
        options: statusOptions,
      },
    ],
    [statusFilter, statusOptions],
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CustomersHeader
          onAddClick={() => setAddOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
        />

        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList className="h-11 w-fit rounded-md border border-slate-200 bg-slate-100 p-0 gap-0 shadow-sm">
            <TabsTrigger value="profiles" className={cn(TAB_TRIGGER_CLASS)}>
              <Users className="mr-2 h-4 w-4" /> Profiles
            </TabsTrigger>
            <TabsTrigger value="accounts" className={cn(TAB_TRIGGER_CLASS)}>
              <UserCog className="mr-2 h-4 w-4" /> Accounts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profiles">
            {isLoading ? (
              <TablePageSkeleton />
            ) : (
              <CustomersTable
                searchQuery={searchQuery}
                statusFilter={statusFilter}
              />
            )}
          </TabsContent>

          <TabsContent value="accounts">
            <Card className="p-6">
              <AccountsTab scope="customer" />
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddCustomerModal open={addOpen} onOpenChange={setAddOpen} />
    </DashboardLayout>
  );
}
