import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Pagination } from "@/components/shared/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/ui/popover";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import {
  ToggleLeft,
  ToggleRight,
  Trash2,
  MoreVertical,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCustomers as useUserCustomers,
  useChangeCustomerStat,
  useEmployees as useUserEmployees,
  useChangeEmployeeStat,
  useDeleteUser,
} from "@/service/user/user.queries";
import { customerKeys } from "@/service/customer/customer.keys";
import { employeeKeys } from "@/service/employee/employee.keys";
import type { CustomerListDto } from "@/types/customer";
import type { EmployeeListDto } from "@/types/employee";

const ITEMS_PER_PAGE = 8;

type AccountRow = {
  id: string;
  fullName: string;
  email: string;
  isActiveStr: string;
  isActive: boolean;
};

/**
 * Account management tab. `scope` decides whether it lists
 * customer accounts (User/AllCust) or employee accounts (User/AllEmp).
 */
export function AccountsTab({ scope }: { scope: "customer" | "employee" }) {
  const queryClient = useQueryClient();

  const customersQuery = useUserCustomers();
  const employeesQuery = useUserEmployees();
  const changeCustomerStat = useChangeCustomerStat();
  const changeEmployeeStat = useChangeEmployeeStat();
  const deleteUser = useDeleteUser();

  const isCustomer = scope === "customer";
  const isLoading = isCustomer ? customersQuery.isLoading : employeesQuery.isLoading;

  const [toggleTarget, setToggleTarget] = useState<AccountRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AccountRow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rows: AccountRow[] = useMemo(() => {
    const source: (CustomerListDto | EmployeeListDto)[] = isCustomer
      ? (customersQuery.data ?? [])
      : (employeesQuery.data ?? []);
    return source.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      isActiveStr: u.status,
      isActive:  u.status === "Active",
    }));
  }, [isCustomer, customersQuery.data, employeesQuery.data]);

  const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);
  const paginated = useMemo(
    () =>
      rows.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [rows, currentPage],
  );

  // Keep the profiles tables (customer/employee services) in sync too —
  // the mock (and likely the backend) stores status on the same record.
  const invalidateRelated = () => {
    if (isCustomer) {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    } else {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    }
  };

  const handleToggle = async () => {
    if (!toggleTarget) return;
    const mutation = isCustomer ? changeCustomerStat : changeEmployeeStat;
    try {
      const message = await mutation.mutateAsync({
        id: toggleTarget.id,
        stat: !toggleTarget.isActive,
      });
      toast.success(
        message ??
          `Account ${toggleTarget.isActive ? "deactivated" : "activated"}`,
      );
      setToggleTarget(null);
      invalidateRelated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update account");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const message = await deleteUser.mutateAsync(deleteTarget.id);
      toast.success(message ?? "Account deleted");
      setDeleteTarget(null);
      // Shared Del endpoint — refresh both account lists + profiles
      queryClient.invalidateQueries({ queryKey: ["users"] });
      invalidateRelated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete account");
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-brown-500">
        Loading accounts…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-brown-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-brown-50 border-b border-brown-200">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-brown-700">
                Name
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-brown-700">
                Email
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-brown-700">
                Status
              </th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-brown-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brown-100">
            {paginated.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  <UserCog className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  No accounts found
                </td>
              </tr>
            )}
            {paginated.map((account) => (
              <tr
                key={account.id}
                className="hover:bg-brown-50/50 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-brown-900">
                  {account.fullName}
                </td>
                <td className="px-4 py-3 text-sm text-brown-600">
                  {account.email}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    className={
                      account.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {account.isActiveStr ||
                      (account.isActive ? "Active" : "Inactive")}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-brown-300 text-brown-700 hover:bg-yellow-50"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-44 p-1" align="end">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={
                            isCustomer
                              ? changeCustomerStat.isPending
                              : changeEmployeeStat.isPending
                          }
                          onClick={() => setToggleTarget(account)}
                          className={`w-full justify-start gap-2 font-normal ${
                            account.isActive
                              ? "text-yellow-700 hover:bg-yellow-50"
                              : "text-green-700 hover:bg-green-50"
                          }`}
                        >
                          {account.isActive ? (
                            <>
                              <ToggleRight className="h-4 w-4" /> Deactivate
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-4 w-4" /> Activate
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(account)}
                          className="w-full justify-start gap-2 font-normal text-red-600 hover:bg-red-50"
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
        totalItems={rows.length}
      />

      {/* Toggle confirmation */}
      <DeleteConfirmationModal
        open={toggleTarget !== null}
        onOpenChange={(open) => {
          if (!open) setToggleTarget(null);
        }}
        title={
          toggleTarget?.isActive ? "Deactivate Account" : "Activate Account"
        }
        description={
          toggleTarget?.isActive
            ? `Deactivate the account for ${toggleTarget?.fullName}? They will no longer be able to sign in.`
            : `Activate the account for ${toggleTarget?.fullName}? They will be able to sign in again.`
        }
        confirmLabel={toggleTarget?.isActive ? "Deactivate" : "Activate"}
        onConfirm={handleToggle}
      />

      <DeleteConfirmationModal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Account"
        description={`Are you sure you want to delete the account for ${deleteTarget?.fullName}? This cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
