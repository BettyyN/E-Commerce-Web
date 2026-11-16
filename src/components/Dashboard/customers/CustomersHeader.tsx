import { Button } from "@/components/shared/ui/button";
import { UserPlus } from "lucide-react";
import { TableToolbar } from "@/components/shared/TableToolbar";
import type { TableFilter } from "@/lib/tableFilters";

interface CustomersHeaderProps {
  onAddClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filters?: TableFilter[];
}

export function CustomersHeader({
  onAddClick,
  searchQuery,
  onSearchChange,
  filters = [],
}: CustomersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-brown-900">Customers</h1>
        <p className="text-brown-600">
          Manage customer accounts and approvals
        </p>
      </div>

      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search customers..."
        filters={filters}
      >
        <Button
          onClick={onAddClick}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </TableToolbar>
    </div>
  );
}
