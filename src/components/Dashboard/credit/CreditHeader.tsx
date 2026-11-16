import { TableToolbar } from "@/components/shared/TableToolbar";
import type { TableFilter } from "@/lib/tableFilters";

interface CreditHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters?: TableFilter[];
}

export function CreditHeader({
  searchQuery,
  onSearchChange,
  // filters = [],
}: CreditHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-brown-900">
          Credit Management
        </h1>
        <p className="text-brown-600">Track customer credit and payments</p>
      </div>

      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search credit..."
        // filters={filters}
      />
    </div>
  );
}
