import { useState } from "react";
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
import { toUtcIso, BTN_PRIMARY, BTN_OUTLINE } from "@/lib/utils";

const EMPTY = {
  sortOrder: "1",
  itemPkg: "1 PCS",
  name: "",
  totalPrice: "",
  quantity: "",
  packagingTypeId: "",
  measTypeId: "",
  batchNumber: "",
  manufactureDate: "",
  expireDate: "",
};

export function AddVariantModal({
  open,
  productId,
  measTypes,
  packTypes,
  onClose,
  onAdd,
}: {
  open: boolean;
  productId: string;
  measTypes: { id: string; name: string }[];
  packTypes: { id: string; name: string }[];
  onClose: () => void;
  onAdd: (payload: {
    sortOrder: number;
    itemPkg: string;
    name: string;
    totalPrice: number;
    quantity: number;
    batchNumber: string;
    manufactureDate: string | null;
    expireDate: string | null;
    isDefault: boolean;
    packagingTypeId: string;
    measTypeId: string;
    productId: string;
  }) => void;
}) {
  const [form, setForm] = useState(EMPTY);

  const handleAdd = () => {
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
    const price = parseFloat(form.totalPrice);
    if (!price || price <= 0) {
      toast.error("Enter a valid price");
      return;
    }
    if (!form.packagingTypeId || !form.measTypeId) {
      toast.error("Select packaging and measurement type");
      return;
    }
    onAdd({
      sortOrder,
      itemPkg: form.itemPkg.trim(),
      name: form.name.trim(),
      totalPrice: price,
      quantity: parseInt(form.quantity) || 0,
      batchNumber: form.batchNumber,
      manufactureDate: toUtcIso(form.manufactureDate),
      expireDate: toUtcIso(form.expireDate),
      isDefault: false,
      packagingTypeId: form.packagingTypeId,
      measTypeId: form.measTypeId,
      productId,
    });
    setForm(EMPTY);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto space-y-4">
        <div>
          <h3 className="text-base font-semibold text-brown-900">
            Add Variant
          </h3>
          <p className="text-xs text-brown-400 mt-0.5">
            Fill in the variant details below
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
              Total Price (ETB) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              step="0.01"
              value={form.totalPrice}
              onChange={(e) => setForm({ ...form, totalPrice: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Quantity</Label>
            <Input
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
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
          <div className="space-y-1.5">
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
          <div className="col-span-2 space-y-1.5">
            <Label>Expire Date</Label>
            <Input
              type="date"
              value={form.expireDate}
              onChange={(e) => setForm({ ...form, expireDate: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            onClick={onClose}
            className={`flex-1 ${BTN_OUTLINE}`}
          >
            Cancel
          </Button>
          <Button onClick={handleAdd} className={`flex-1 ${BTN_PRIMARY}`}>
            Add Variant
          </Button>
        </div>
      </div>
    </div>
  );
}
