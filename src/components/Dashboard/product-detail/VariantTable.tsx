import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Card } from "@/components/shared/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/ui/popover";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import {
  Star,
  Trash2,
  MoreVertical,
  Plus,
  Package,
  Power,
  Coins,
  Boxes,
  Percent,
  PackageOpen,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useAddProVariant,
  useUpdateProVariant,
  useUpdateProVariantPrice,
  useUpdateProVariantQty,
  useChangeProVariantDefault,
  useChangeProVariantStat,
  useDeleteProVariant,
} from "@/service/proVar/proVar.queries";
import type { ProVarListDto } from "@/types/productVariant";
import { ChangeValueModal } from "./ChangeValueModal";
import { EditVariantModal } from "./EditVariantModal";
import { AddVariantModal } from "./AddVariantModal.tsx";

interface VariantTableProps {
  productId: string;
  productName: string;
  variants: ProVarListDto[];
  measTypes: { id: string; name: string }[];
  packTypes: { id: string; name: string }[];
}

export function VariantTable({
  productId,
  variants,
  measTypes,
  packTypes,
}: VariantTableProps) {
  const navigate = useNavigate();

  const addVariant = useAddProVariant();
  const updateVariant = useUpdateProVariant();
  const updatePrice = useUpdateProVariantPrice();
  const updateQty = useUpdateProVariantQty();
  const changeDefault = useChangeProVariantDefault();
  const changeVariantStat = useChangeProVariantStat();
  const deleteVariant = useDeleteProVariant();

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<ProVarListDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProVarListDto | null>(null);
  const [statusTarget, setStatusTarget] = useState<ProVarListDto | null>(null);
  const [defaultTarget, setDefaultTarget] = useState<ProVarListDto | null>(
    null,
  );
  const [priceTarget, setPriceTarget] = useState<ProVarListDto | null>(null);
  const [qtyTarget, setQtyTarget] = useState<ProVarListDto | null>(null);

  return (
    <>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-brown-900">
            Variants
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 font-semibold px-1.5 py-0.5 rounded-full">
              {variants.length}
            </span>
          </h3>
          <Button
            size="sm"
            onClick={() => setShowAdd(true)}
            className="h-8 px-3 text-xs bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>

        {variants.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">
            <PackageOpen className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            No variants yet. Add one above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {variants.map((v) => {
              const isActive = v.status === "Active";
              const isDefault = v.isDefaultStr === "Yes";

              return (
                <div
                  key={v.id}
                  className={cn(
                    "relative rounded-xl border bg-white p-4 transition-shadow",
                    isDefault
                      ? "border-yellow-300 ring-1 ring-yellow-200"
                      : "border-slate-200",
                    isActive && "hover:shadow-md",
                  )}
                >
                  {/* Sort order badge — top-left corner */}
                  <span
                    title="Sort order"
                    className="absolute -top-2 -left-2 z-10 flex h-6 min-w-6 items-center justify-center rounded-full bg-yellow-400 px-1.5 text-[11px] font-bold text-slate-900 shadow-sm ring-2 ring-white"
                  >
                    #{v.sortOrder}
                  </span>
                  {/* Card content — blurred + inert when inactive */}
                  <div
                    aria-hidden={!isActive}
                    className={cn(
                      "space-y-3 transition",
                      !isActive &&
                        "blur-[1.5px] grayscale opacity-60 pointer-events-none select-none",
                    )}
                  >
                    {/* Header */}
                    <div className="pr-8">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-brown-900">
                          {v.name}
                        </span>
                        {isDefault && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 gap-0.5 text-[10px] px-1.5 py-0">
                            <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center overflow-hidden rounded-full bg-slate-100 text-[11px] text-slate-600">
                          <span className="px-2 py-0.5">
                            Pack Type: {v.packagingType || "—"}
                          </span>
                          <span className="border-l border-slate-200 bg-slate-200/60 px-2 py-0.5 font-semibold text-slate-700">
                            {v.itemPkg || "—"}
                          </span>
                        </span>
                        <span className="text-[11px] bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
                          Meas Type: {v.measType || "—"}
                        </span>
                      </div>
                    </div>

                    {/* Price + stock */}
                    <div className="flex items-end justify-between border-t border-slate-100 pt-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">
                          Price
                        </p>
                        <p className="text-lg font-bold text-brown-900 leading-tight">
                          {v.totPrice}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">
                          In stock
                        </p>
                        <p className="text-lg font-bold text-brown-700 leading-tight">
                          {v.qtyStr}
                        </p>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPriceTarget(v)}
                        className="h-8 text-xs border-yellow-200 text-yellow-700 hover:bg-yellow-50 gap-1"
                      >
                        <Coins className="h-3.5 w-3.5" /> Change Price
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQtyTarget(v)}
                        className="h-8 text-xs border-slate-200 text-slate-600 hover:bg-slate-50 gap-1"
                      >
                        <Boxes className="h-3.5 w-3.5" /> Change Qty
                      </Button>
                    </div>
                  </div>

                  {/* Menu — always sharp and clickable, sits above the blur */}
                  <div className="absolute top-3 right-3 z-10">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-brown-500 hover:bg-yellow-50"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-44 p-1" align="end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditTarget(v)}
                          className="w-full justify-start gap-2 text-xs font-normal text-brown-700 hover:bg-yellow-50"
                        >
                          <Package className="h-4 w-4" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setStatusTarget(v)}
                          className="w-full justify-start gap-2 text-xs font-normal text-brown-700 hover:bg-yellow-50"
                        >
                          <Power className="h-4 w-4" />
                          {isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDefaultTarget(v)}
                          disabled={isDefault}
                          className="w-full justify-start gap-2 text-xs font-normal text-brown-700 hover:bg-yellow-50 disabled:opacity-50"
                        >
                          <Star className="h-4 w-4" /> Set as Default
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/dashboard/products/${productId}/variants/${v.id}/discounts`,
                              {
                                state: {
                                  variantId: v.id,
                                  variantName: v.name,
                                  productId,
                                },
                              },
                            )
                          }
                          className="w-full justify-start gap-2 text-xs font-normal text-brown-700 hover:bg-yellow-50"
                        >
                          <Percent className="h-4 w-4" /> Discounts
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(v)}
                          className="w-full justify-start gap-2 text-xs font-normal text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Inactive overlay — badge + one-tap reactivate */}
                  {!isActive && (
                    <div className="absolute inset-0 z-5 flex flex-col items-center justify-center gap-2 rounded-xl pointer-events-none">
                      <Badge className="bg-slate-800 text-white border-slate-800 text-[10px] tracking-wide uppercase">
                        Inactive
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => setStatusTarget(v)}
                        className="pointer-events-auto h-7 px-3 text-xs bg-white text-brown-800 border border-yellow-300 hover:bg-yellow-50 shadow-sm gap-1"
                      >
                        <Power className="h-3 w-3" /> Activate
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <AddVariantModal
        open={showAdd}
        productId={productId}
        measTypes={measTypes}
        packTypes={packTypes}
        onClose={() => setShowAdd(false)}
        onAdd={async (payload) => {
          try {
            const message = await addVariant.mutateAsync(payload);
            toast.success(message ?? "Variant added");
            setShowAdd(false);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to add variant");
          }
        }}
      />

      {editTarget && (
        <EditVariantModal
          variant={editTarget}
          measTypes={measTypes}
          packTypes={packTypes}
          onClose={() => setEditTarget(null)}
          onSave={async (data) => {
            try {
              const message = await updateVariant.mutateAsync(data);
              setEditTarget(null);
              toast.success(message ?? "Variant updated");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Failed to update variant");
            }
          }}
        />
      )}

      {priceTarget && (
        <ChangeValueModal
          title={`Change Price — ${priceTarget.name}`}
          label="Price"
          unit="ETB"
          current={parseFloat(priceTarget.totPrice) || 0}
          onClose={() => setPriceTarget(null)}
          onSave={async (val) => {
            try {
              const message = await updatePrice.mutateAsync({
                id: priceTarget.id,
                totalPrice: val,
              });
              setPriceTarget(null);
              toast.success(message ?? "Price updated");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Failed to update price");
            }
          }}
        />
      )}

      {qtyTarget && (
        <ChangeValueModal
          title={`Change Quantity — ${qtyTarget.name}`}
          label="Quantity"
          unit="units"
          current={parseFloat(String(qtyTarget.qtyStr)) || 0}
          onClose={() => setQtyTarget(null)}
          onSave={async (val) => {
            try {
              const message = await updateQty.mutateAsync({
                id: qtyTarget.id,
                quantity: val,
              });
              setQtyTarget(null);
              toast.success(message ?? "Quantity updated");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Failed to update quantity");
            }
          }}
        />
      )}

      <DeleteConfirmationModal
        open={!!statusTarget}
        onOpenChange={(o) => {
          if (!o) setStatusTarget(null);
        }}
        title="Change Variant Status"
        description={`Mark "${statusTarget?.name}" as ${statusTarget?.status === "Active" ? "Inactive" : "Active"}?`}
        confirmLabel="Confirm"
        onConfirm={async () => {
          if (!statusTarget) return;
          try {
            const message = await changeVariantStat.mutateAsync({
              id: statusTarget.id,
              stat: statusTarget.status !== "Active",
            });
            toast.success(message ?? `"${statusTarget.name}" status updated`);
            setStatusTarget(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update status");
          }
        }}
      />

      <DeleteConfirmationModal
        open={!!defaultTarget}
        onOpenChange={(o) => {
          if (!o) setDefaultTarget(null);
        }}
        title="Set Default Variant"
        description={`Make "${defaultTarget?.name}" the default variant shown to customers?`}
        confirmLabel="Confirm"
        onConfirm={async () => {
          if (!defaultTarget) return;
          try {
            const message = await changeDefault.mutateAsync(defaultTarget.id);
            toast.success(message ?? `"${defaultTarget.name}" is now the default`);
            setDefaultTarget(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to set default variant");
          }
        }}
      />

      <DeleteConfirmationModal
        open={!!deleteTarget}
        onOpenChange={(o) => {
          if (!o) setDeleteTarget(null);
        }}
        title="Delete Variant"
        description={`Delete variant "${deleteTarget?.name}"? Its discounts go with it. This cannot be undone.`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            const message = await deleteVariant.mutateAsync(deleteTarget.id);
            toast.success(message ?? "Variant deleted");
            setDeleteTarget(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete variant");
          }
        }}
      />
    </>
  );
}
