import { useState } from "react";
import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/ui/popover";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import {
  Trash2,
  CalendarDays,
  Power,
  Edit,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import {
  useChangeProDiscountStat,
  useDeleteProDiscount,
} from "@/service/proDiscnt/proDiscnt.queries";
import { EditDiscountModal } from "./EditDiscountModal";
import type { VarDiscntListDto } from "@/types/productDiscount";

interface VariantDiscountTableProps {
  discounts: VarDiscntListDto[];
  isLoading: boolean;
}

export function VariantDiscountTable({
  discounts,
  isLoading,
}: VariantDiscountTableProps) {
  const changeStat = useChangeProDiscountStat();
  const deleteDiscount = useDeleteProDiscount();

  const [editItem, setEditItem] = useState<VarDiscntListDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VarDiscntListDto | null>(
    null,
  );
  const [statusTarget, setStatusTarget] = useState<VarDiscntListDto | null>(
    null,
  );

  const isActive = (d: VarDiscntListDto) => d.status === "Active";

  return (
    <>
      <Card className="p-5">
        {isLoading ? (
          <p className="text-center text-brown-500 py-10">Loading discounts…</p>
        ) : discounts.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-10 border border-dashed border-slate-200 rounded-xl">
            No discounts yet. Click "Add Discount" to get started.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Type
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Value
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Old → New
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Period
                  </th>
                  <th className="text-center px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-right px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {discounts.map((d) => (
                  <tr key={d.id} className="hover:bg-yellow-50/40">
                    <td className="px-3 py-3">
                      <Badge
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {d.type}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 font-semibold text-brown-900">
                      {d.valueStr}
                    </td>
                    <td className="px-3 py-3 text-slate-600 text-sm">
                      {d.oldPriceStr} →{" "}
                      <span className="font-semibold text-green-700">
                        {d.newPriceStr}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                        {d.startDateAt?.split("T")[0]} →{" "}
                        {d.endDateAt?.split("T")[0]}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge
                        className={
                          isActive(d)
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }
                      >
                        {d.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-brown-700 hover:bg-yellow-50"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-44 p-2" align="end">
                            <div className="flex flex-col">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditItem(d)}
                                className="justify-start gap-2 font-normal text-brown-700 hover:bg-yellow-50"
                              >
                                <Edit className="h-4 w-4" /> Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setStatusTarget(d)}
                                className="justify-start gap-2 font-normal text-brown-700 hover:bg-yellow-50"
                              >
                                <Power className="h-4 w-4" />{" "}
                                {isActive(d) ? "Deactivate" : "Activate"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteTarget(d)}
                                className="justify-start gap-2 font-normal text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" /> Delete
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <EditDiscountModal item={editItem} onClose={() => setEditItem(null)} />

      <DeleteConfirmationModal
        open={!!statusTarget}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
        title="Change Discount Status"
        description={`Are you sure you want to ${statusTarget && isActive(statusTarget) ? "deactivate" : "activate"} this discount?`}
        confirmLabel="Confirm"
        onConfirm={async () => {
          if (!statusTarget) return;
          const wasActive = isActive(statusTarget);
          try {
            const message = await changeStat.mutateAsync({
              id: statusTarget.id,
              stat: !wasActive,
            });
            toast.success(
              message ?? `Discount ${wasActive ? "deactivated" : "activated"}`,
            );
            setStatusTarget(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update status");
          }
        }}
      />

      <DeleteConfirmationModal
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Discount"
        description="Delete this discount? This cannot be undone."
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            const message = await deleteDiscount.mutateAsync(deleteTarget.id);
            toast.success(message ?? "Discount deleted");
            setDeleteTarget(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete discount");
          }
        }}
      />
    </>
  );
}
