import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui/card";
import { Badge } from "@/components/shared/ui/badge";
import { Button } from "@/components/shared/ui/button";
import { Eye } from "lucide-react";
import { TableToolbar } from "@/components/shared/TableToolbar";
import {
  ALL_FILTER,
  toFilterOptions,
  type TableFilter,
} from "@/lib/tableFilters";
import type { MyCrdtListDto } from "@/types/myCredit";
import { getCreditStatusColor } from "@/lib/format";
import { formatETB } from "@/lib/utils";

interface Props {
  credits: MyCrdtListDto[];
  totalCredit: number;
}

export function CreditTab({ credits, totalCredit }: Props) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER);

  const statusOptions = useMemo(
    () => toFilterOptions(credits.map((c) => c.status)),
    [credits],
  );

  const filters: TableFilter[] = useMemo(
    () => [
      {
        value: statusFilter,
        onChange: setStatusFilter,
        allLabel: "All statuses",
        options: statusOptions,
      },
    ],
    [statusFilter, statusOptions],
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
        (credit.status ?? "").toLowerCase().includes(q) ||
        (credit.total ?? "").toLowerCase().includes(q) ||
        (credit.paid ?? "").toLowerCase().includes(q) ||
        (credit.remain ?? "").toLowerCase().includes(q)
      );
    });
  }, [credits, searchQuery, statusFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || statusFilter !== ALL_FILTER;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
          <CardTitle className="text-lg font-semibold">
            Credit History
          </CardTitle>
          <div className="flex gap-3">
            <TableToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search credits..."
              filters={filters}
              filterClassName="border-slate-200 text-slate-700"
            />
            <div>
              <p className="text-sm text-slate-500">Outstanding Credit</p>
              <p className="text-2xl font-semibold text-emerald-700">
                {formatETB(totalCredit)} ETB
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b bg-slate-50/70">
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Credit
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Paid
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Remaining
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCredits.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-sm text-slate-400"
                  >
                    {hasActiveFilters
                      ? "No credit records match your search or filters."
                      : "No credit records yet. Request credit at checkout."}
                  </td>
                </tr>
              )}
              {filteredCredits.map((credit) => (
                <tr
                  key={credit.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {credit.code}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {credit.orderCode}
                  </td>
                  <td className="px-6 py-4 text-slate-900">
                    {credit.total}
                  </td>
                  <td className="px-6 py-4 text-green-700">
                    {credit.paid}
                  </td>
                  <td className="px-6 py-4 font-medium text-red-600">
                    {credit.remain}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getCreditStatusColor(credit.status)}>
                      {credit.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/customer/credits/${credit.id}`)}
                      className="border-slate-200 text-slate-700 hover:bg-yellow-50 gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
