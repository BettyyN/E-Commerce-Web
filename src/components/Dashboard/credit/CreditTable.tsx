import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Pagination } from "@/components/shared/ui/pagination";
import { Eye } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ALL_FILTER, useResettablePage } from "@/lib/tableFilters";
import type { CreditListDto } from "@/types/credit";

const ITEMS_PER_PAGE = 5;

interface CreditTableProps {
  credits: CreditListDto[];
  isLoading?: boolean;
  searchQuery?: string;
  statusFilter?: string;
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  loadingMessage?: string;
}

export function CreditTable({
  credits,
  isLoading = false,
  searchQuery = "",
  statusFilter = ALL_FILTER,
  title = "Credits",
  subtitle = "Unpaid first, then settled credits",
  emptyMessage = "No credit records",
  loadingMessage = "Loading credits…",
}: CreditTableProps) {
  const navigate = useNavigate();
  // Pagination resets to page 1 whenever the search or a filter changes.
  const [currentPage, setCurrentPage] = useResettablePage(
    `${searchQuery.trim()}|${statusFilter}`,
  );

  const filteredCredits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return credits.filter((credit) => {
      if (
        statusFilter !== ALL_FILTER &&
        (credit.status ?? "").toLowerCase() !== statusFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        (credit.code ?? "").toLowerCase().includes(q) ||
        (credit.orderCode ?? "").toLowerCase().includes(q) ||
        (credit.customer ?? "").toLowerCase().includes(q) ||
        (credit.status ?? "").toLowerCase().includes(q) ||
        (credit.total ?? "").toLowerCase().includes(q) ||
        (credit.paid ?? "").toLowerCase().includes(q) ||
        (credit.remain ?? "").toLowerCase().includes(q) ||
        (credit.remark ?? "").toLowerCase().includes(q)
      );
    });
  }, [credits, searchQuery, statusFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || statusFilter !== ALL_FILTER;

  const totalPages = Math.max(
    Math.ceil(filteredCredits.length / ITEMS_PER_PAGE),
    1,
  );
  const safePage = Math.min(currentPage, totalPages);

  const paginatedCredits = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredCredits.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCredits, safePage]);

  return (
    <Card className="p-6">
      {isLoading ? (
        <p className="py-8 text-center text-sm text-brown-500">
          {loadingMessage}
        </p>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brown-900">
              {title}
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 font-semibold px-1.5 py-0.5 rounded-full align-middle">
                {filteredCredits.length}
              </span>
            </h2>
            <p className="text-xs text-brown-500">{subtitle}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brown-200">
                  <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                    Credit Code
                  </th>
                  <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                    Order
                  </th>
                  <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                    Paid
                  </th>
                  <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                    Remaining
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
                {paginatedCredits.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 px-4 text-center text-sm text-slate-400"
                >
                  {hasActiveFilters
                    ? "No credits match your search or filters"
                    : emptyMessage}
                </td>
                  </tr>
                )}
                {paginatedCredits.map((credit: CreditListDto) => {
                  const isPaid = credit.status === "Paid";
                  return (
                    <tr
                      key={credit.id}
                      className="border-b border-brown-100 hover:bg-brown-50"
                    >
                      <td className="py-3 px-4 text-brown-900 font-medium">
                        {credit.code}
                      </td>
                      <td className="py-3 px-4 text-brown-700">
                        {credit.orderCode}
                      </td>
                      <td className="py-3 px-4 text-brown-700">
                        {credit.customer}
                      </td>
                      <td className="py-3 px-4 text-brown-700">
                        {credit.total}
                      </td>
                      <td className="py-3 px-4 text-green-700">
                        {credit.paid}
                      </td>
                      <td className="py-3 px-4 text-brown-900 font-medium">
                        {credit.remain}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            isPaid
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {credit.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate(
                                `/dashboard/credit/${encodeURIComponent(credit.id)}`,
                              )
                            }
                            className="border-brown-300 text-brown-700 hover:bg-yellow-50 gap-1.5"
                          >
                            <Eye className="h-3.5 w-3.5" /> View Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredCredits.length}
          />
        </>
      )}
    </Card>
  );
}
