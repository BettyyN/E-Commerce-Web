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
import { EditCustomerModal } from "./EditCustomerModal";
import CustomerActivationModal from "./ActivationModal";
import {
  Edit,
  Trash2,
  MoreVertical,
  Power,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCustomers,
  useDeleteCustomer,
} from "@/service/customer/customer.queries";
import {
  isActiveCustomer,
  customerStatusLabel,
} from "@/lib/format";
import { ALL_FILTER, useResettablePage } from "@/lib/tableFilters";
import type { CustomerListDto } from "@/types/customer";

const ITEMS_PER_PAGE = 8;

interface CustomersTableProps {
  searchQuery?: string;
  statusFilter?: string;
}

export function CustomersTable({
  searchQuery = "",
  statusFilter = ALL_FILTER,
}: CustomersTableProps) {
  const { data: customers = [] } = useCustomers();
  const deleteCustomer = useDeleteCustomer();

  // Pagination resets to page 1 whenever the search or a filter changes.
  const [currentPage, setCurrentPage] = useResettablePage(
    `${searchQuery.trim()}|${statusFilter}`,
  );
  const [editTarget, setEditTarget] = useState<CustomerListDto | null>(null);
  const [activationTarget, setActivationTarget] =
    useState<CustomerListDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerListDto | null>(
    null,
  );

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return customers.filter((c) => {
      const status = customerStatusLabel(c);
      if (
        statusFilter !== ALL_FILTER &&
        status.toLowerCase() !== statusFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phoneNum.toLowerCase().includes(q) ||
        (c.tin ?? "").toLowerCase().includes(q) ||
        status.toLowerCase().includes(q)
      );
    });
  }, [customers, searchQuery, statusFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || statusFilter !== ALL_FILTER;

  const totalPages = Math.max(
    Math.ceil(filtered.length / ITEMS_PER_PAGE),
    1,
  );
  const safePage = Math.min(currentPage, totalPages);

  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

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
                  Phone
                </th>
                <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                  TIN Number
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
                    colSpan={6}
                    className="py-10 text-center text-sm text-slate-400"
                >
                  <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  {hasActiveFilters
                    ? "No customers match your search or filters"
                    : "No customers found"}
                </td>
                </tr>
              )}
              {paginated.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-brown-100 hover:bg-brown-50"
                >
                  <td className="py-3 px-4 text-brown-900">{c.fullName}</td>
                  <td className="py-3 px-4 text-brown-700">{c.email}</td>
                  <td className="py-3 px-4 text-brown-700">{c.phoneNum}</td>
                  <td className="py-3 px-4 text-brown-700">
                    {c.tin || "—"}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      className={
                        isActiveCustomer(c)
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {customerStatusLabel(c)}
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
                            onClick={() => setActivationTarget(c)}
                            className="w-full justify-start gap-2 text-brown-700 hover:bg-yellow-50"
                          >
                            <Power className="h-4 w-4" />
                            {isActiveCustomer(c) ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditTarget(c)}
                            className="w-full justify-start gap-2 text-brown-700 hover:bg-yellow-50"
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(c)}
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
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filtered.length}
        />
      </Card>

      <EditCustomerModal
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        customer={editTarget}
      />
      <CustomerActivationModal
        open={!!activationTarget}
        onOpenChange={(open) => {
          if (!open) setActivationTarget(null);
        }}
        customer={activationTarget}
      />
      <DeleteConfirmationModal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Customer"
        description={`Are you sure you want to delete ${deleteTarget?.fullName}? This cannot be undone.`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            const message = await deleteCustomer.mutateAsync(deleteTarget.id);
            toast.success(message ?? "Customer deleted");
            setDeleteTarget(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete customer");
          }
        }}
      />
    </>
  );
}
