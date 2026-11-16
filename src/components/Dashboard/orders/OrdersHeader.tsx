import { TableToolbar } from "@/components/shared/TableToolbar";
import type { TableFilter } from "@/lib/tableFilters";

interface OrdersHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters?: TableFilter[];
}

export function OrdersHeader({
  searchQuery,
  onSearchChange,
  filters = [],
}: OrdersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-brown-900">Orders</h1>
        <p className="text-brown-600">Manage and track all orders</p>
      </div>

      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search orders..."
        filters={filters}
      >
      </TableToolbar>
    </div>
  );
}
