import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Search, UserPlus } from "lucide-react";

interface EmployeesHeaderProps {
  onAddClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function EmployeesHeader({
  onAddClick,
  searchQuery,
  onSearchChange,
}: EmployeesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-brown-900">Employees</h1>
        <p className="text-brown-600">Manage employee accounts and roles</p>
      </div>

      <div className="flex gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={onAddClick}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>
    </div>
  );
}
