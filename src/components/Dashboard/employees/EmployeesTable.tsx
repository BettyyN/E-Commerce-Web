import { useState, useMemo } from "react";
import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Pagination } from "@/components/shared/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/ui/popover";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { EditEmployeeModal } from "./EditEmployeeModal";
import ActivationModal from "./ActivationModal";
import { Edit, Trash2, MoreVertical, Power, Users } from "lucide-react";
import { toast } from "sonner";
import {
  useEmployees,
  useDeleteEmployee,
} from "@/service/employee/employee.queries";
import type { EmployeeListDto } from "@/types/employee";

const ITEMS_PER_PAGE = 8;

export function EmployeesTable({ searchQuery = "" }: { searchQuery?: string }) {
  const { data: employees = [] } = useEmployees();
  const deleteEmployee = useDeleteEmployee();

  const [currentPage, setCurrentPage] = useState(1);
  const [editTarget, setEditTarget] = useState<EmployeeListDto | null>(null);
  const [activationTarget, setActivationTarget] =
    useState<EmployeeListDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EmployeeListDto | null>(
    null,
  );

  const filtered = useMemo(() => {
    if (!searchQuery) return employees;
    const q = searchQuery.toLowerCase();
    return employees.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q),
    );
  }, [employees, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [filtered, currentPage],
  );

  const isActive = (e: EmployeeListDto) =>e.status === "Active";

  return (
    <>
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brown-200">
                <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                  Full Name
                </th>
                <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-brown-700 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-sm text-slate-400"
                  >
                    <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    No employees found
                  </td>
                </tr>
              )}
              {paginated.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b border-brown-100 hover:bg-brown-50"
                >
                  <td className="py-3 px-4 text-brown-900">{emp.fullName}</td>
                  <td className="py-3 px-4 text-brown-700">{emp.email}</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-blue-100 text-blue-800 capitalize">
                      {emp.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      className={
                        isActive(emp)
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {emp.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-brown-300 text-brown-700 hover:bg-yellow-50"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-44 p-1" align="end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActivationTarget(emp)}
                            className="w-full justify-start gap-2 text-brown-700 hover:bg-yellow-50"
                          >
                            <Power className="h-4 w-4" />
                            {isActive(emp) ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditTarget(emp)}
                            className="w-full justify-start gap-2 text-brown-700 hover:bg-yellow-50"
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(emp)}
                            className="w-full justify-start gap-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filtered.length}
        />
      </Card>

      <EditEmployeeModal
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        employee={editTarget}
      />
      <ActivationModal
        open={!!activationTarget}
        onOpenChange={(open) => {
          if (!open) setActivationTarget(null);
        }}
        employee={activationTarget}
      />
      <DeleteConfirmationModal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Employee"
        description={`Are you sure you want to delete ${deleteTarget?.fullName}? This cannot be undone.`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            const message = await deleteEmployee.mutateAsync(deleteTarget.id);
            toast.success(message ?? "Employee deleted");
            setDeleteTarget(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete employee");
          }
        }}
      />
    </>
  );
}
