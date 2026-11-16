import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import { CreditTabs } from "@/components/Dashboard/credit/CreditTabs";
import { CreditHeader } from "@/components/Dashboard/credit/CreditHeader";
import {
  ALL_FILTER,
  type TableFilter,
} from "@/lib/tableFilters";

export default function CreditPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER);

  const filters: TableFilter[] = useMemo(
    () => [
      {
        value: statusFilter,
        onChange: setStatusFilter,
        allLabel: "All statuses",
        options: [
          { value: "unpaid", label: "Unpaid" },
          { value: "paid", label: "Paid" },
        ],
      },
    ],
    [statusFilter],
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CreditHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
        />
        <CreditTabs searchQuery={searchQuery} statusFilter={statusFilter} />
      </div>
    </DashboardLayout>
  );
}
