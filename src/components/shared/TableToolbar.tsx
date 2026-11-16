import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_FILTER, type TableFilter } from "@/lib/tableFilters";
import { Input } from "@/components/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/select";

interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: TableFilter[];
  className?: string;
  filterClassName?: string;
  children?: ReactNode;
}

export function TableToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  className,
  filterClassName,
  children,
}: TableToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto",
        className,
      )}
    >
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 h-4 w-4" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {filters.map((filter) => (
        <Select
          key={filter.allLabel}
          value={filter.value}
          onValueChange={filter.onChange}
        >
          <SelectTrigger
            className={cn(
              "w-full sm:w-42 border-brown-300 bg-white text-brown-700",
              filterClassName,
            )}
          >
            <SelectValue placeholder={filter.allLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_FILTER}>{filter.allLabel}</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {children}
    </div>
  );
}
