import { useState, useEffect } from "react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/select";
import { toast } from "sonner";
import { useProVariant } from "@/service/proVar/proVar.queries";
import type { ProVarListDto } from "@/types/productVariant";
import { toUtcIso, toDateInput, BTN_PRIMARY, BTN_OUTLINE } from "@/lib/utils";

export function EditVariantModal({
  variant,
  measTypes,
  packTypes,
  onClose,
  onSave,
}: {
  variant: ProVarListDto;
  measTypes: { id: string; name: string }[];
  packTypes: { id: string; name: string }[];
  onClose: () => void;
  onSave: (data: {
    id: string;
    sortOrder: number;
    itemPkg: string;
    name: string;
    batchNumber: string;
    manufactureDate: string | null;
    expireDate: string | null;
    packagingTypeId: string;
    measTypeId: string;
  }) => void;
}) {
  // batchNumber, manufactureDate and expireDate are not on the list DTO —
  // fetch the full detail for prefilling.
  const { data: detail, isLoading: detailLoading } = useProVariant(variant.id);

  const [form, setForm] = useState({
    sortOrder: String(variant.sortOrder ?? 1),
    itemPkg: variant.itemPkg ?? "1 PCS",
    name: variant.name,
    batchNumber: "",
    manufactureDate: "",
    expireDate: "",
    packagingTypeId:
      packTypes.find((p) => p.name === variant.packagingType)?.id ?? "",
    measTypeId: measTypes.find((m) => m.name === variant.measType)?.id ?? "",
  });

  // Merge the detail fields in once they arrive
  useEffect(() => {
    if (detail) {
      setForm((prev) => ({
        ...prev,
        batchNumber: detail.batchNumber ?? "",
        manufactureDate: toDateInput(detail.manufactureAt),
        expireDate: toDateInput(detail.expireAt),
      }));
    }
  }, [detail]);

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Variant name is required");
      return;
    }
    if (!form.itemPkg.trim()) {
      toast.error("Item package is required");
      return;
    }
    const sortOrder = parseInt(form.sortOrder);
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      toast.error("Sort order must be a whole number, zero or more");
      return;
    }
    if (!form.packagingTypeId || !form.measTypeId) {
      toast.error("Select packaging and measurement type");
      return;
    }
    onSave({
      id: variant.id,
      sortOrder,
      itemPkg: form.itemPkg.trim(),
      name: form.name.trim(),
      batchNumber: form.batchNumber,
      manufactureDate: toUtcIso(form.manufactureDate),
      expireDate: toUtcIso(form.expireDate),
      packagingTypeId: form.packagingTypeId,
      measTypeId: form.measTypeId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto space-y-4">
        <div>
          <h3 className="text-base font-semibold text-brown-900">
            Edit Variant
          </h3>
          <p className="text-xs text-brown-400 mt-0.5">
            Update the details for this variant
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5">
            <Label>
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Item Pkg <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.itemPkg}
              onChange={(e) => setForm({ ...form, itemPkg: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Sort Order</Label>
            <Input
              type="number"
              min={0}
              step={1}
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Packaging Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.packagingTypeId}
              onValueChange={(v) => setForm({ ...form, packagingTypeId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {packTypes.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>
              Meas. Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.measTypeId}
              onValueChange={(v) => setForm({ ...form, measTypeId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {measTypes.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>Batch Number</Label>
            <Input
              value={form.batchNumber}
              onChange={(e) =>
                setForm({ ...form, batchNumber: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Manufacture Date</Label>
            <Input
              type="date"
              value={form.manufactureDate}
              onChange={(e) =>
                setForm({ ...form, manufactureDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Expire Date</Label>
            <Input
              type="date"
              value={form.expireDate}
              onChange={(e) => setForm({ ...form, expireDate: e.target.value })}
            />
          </div>
        </div>

        {detailLoading && (
          <p className="text-xs text-brown-400">Loading variant details…</p>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            onClick={onClose}
            className={`flex-1 ${BTN_OUTLINE}`}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={detailLoading}
            className={`flex-1 ${BTN_PRIMARY}`}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
