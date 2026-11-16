import { useState } from "react";
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shared/ui/tabs";
import { Card } from "@/components/shared/ui/card";
import { AccountsTab } from "@/components/shared/AccountsTab";
import { EmployeesHeader } from "@/components/Dashboard/employees/EmployeesHeader";
import { EmployeesTable } from "@/components/Dashboard/employees/EmployeesTable";
import { AddEmployeeModal } from "@/components/Dashboard/employees/AddEmployeeModal";
import { Users, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEmployees } from "@/service/employee/employee.queries";
import { TablePageSkeleton } from "@/components/shared/PageSkeleton";

const TAB_TRIGGER_CLASS =
  "h-9 rounded-md px-5 text-sm font-medium text-slate-600 transition-all hover:text-slate-900 data-[state=active]:bg-yellow-500 data-[state=active]:text-brown-900 data-[state=active]:shadow-none";

export default function EmployeesPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { isLoading } = useEmployees();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <EmployeesHeader
          onAddClick={() => setAddOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
              <EmployeesTable searchQuery={searchQuery} />
            )}
          </TabsContent>

          <TabsContent value="accounts">
            <Card className="p-6">
              <AccountsTab scope="employee" />
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddEmployeeModal open={addOpen} onOpenChange={setAddOpen} />
    </DashboardLayout>
  );
}
