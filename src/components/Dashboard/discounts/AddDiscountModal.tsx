import { useState } from "react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/shared/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/select";
import { toast } from "sonner";
import { DiscountTypes } from "@/types/enum";
import { useAddProDiscount } from "@/service/proDiscnt/proDiscnt.queries";
import { useProducts } from "@/service/product/product.queries";
import { useProVariants } from "@/service/proVar/proVar.queries";
import { toUtcIso } from "@/lib/utils";

const today = new Date().toISOString().split("T")[0];
const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

const discountTypeOptions = Object.entries(DiscountTypes);

const PERCENTAGE_KEY = discountTypeOptions.find(
  ([, label]) => label === "Percentage",
)?.[0];
const EMPTY = {
  productId: "",
  variantId: "",
  type: Object.keys(DiscountTypes)[0],
  value: "",
  startDate: today,
  endDate: nextMonth,
};

interface AddDiscountModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Pre-set variantId — used from VariantDiscountsPage (no product selector needed) */
  variantId?: string;
}

export function AddDiscountModal({
  open,
  onOpenChange,
  variantId,
}: AddDiscountModalProps) {
  const { data: products = [] } = useProducts();
  const addDiscount = useAddProDiscount();
  const [form, setForm] = useState(EMPTY);
  const { data: formVariants = [] } = useProVariants(
    variantId ? undefined : form.productId || undefined,
  );

  const reset = () => setForm(EMPTY);

  // Resolve final variantId: either prop-supplied or form-selected
  const resolvedVariantId = variantId ?? form.variantId;

  const handleAdd = async () => {
    if (!resolvedVariantId || !form.value || !form.startDate || !form.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    const val = parseFloat(form.value);
    if (isNaN(val) || val <= 0) {
      toast.error("Value must be a positive number");
      return;
    }
    if (form.type === PERCENTAGE_KEY && val >= 100) {
      toast.error("Percentage cannot exceed 100");
      return;
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      const startDate = toUtcIso(form.startDate);
      const endDate = toUtcIso(form.endDate);

      if (!startDate || !endDate) {
        toast.error( "Please provide valid start and end dates.");
        return;
      }
      const message = await addDiscount.mutateAsync({
        type: form.type,
        value: val,
        startDate,
        endDate,
        variantId: resolvedVariantId,
      });
      toast.success(message ?? "Discount added");
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add discount");
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <ModalHeader>
        <ModalTitle>Add Discount</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className="grid grid-cols-2 gap-4">
          {/* Product + Variant selectors only when no variantId is pre-set */}
          {!variantId && (
            <>
              <div className="col-span-2 space-y-1.5">
                <Label>
                  Product <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.productId}
                  onValueChange={(v) =>
                    setForm({ ...form, productId: v, variantId: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>
                  Variant <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.variantId}
                  onValueChange={(v) => setForm({ ...form, variantId: v })}
                  disabled={!form.productId}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        form.productId
                          ? "Select variant"
                          : "Pick a product first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {formVariants.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => setForm({ ...form, type: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent>
                {discountTypeOptions.map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>
              Value <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder={form.type === PERCENTAGE_KEY ? "10" : "5.00"}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              End Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="outline"
          onClick={() => {
            reset();
            onOpenChange(false);
          }}
          className="border-brown-300 text-brown-700 hover:bg-yellow-50 px-6"
        >
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          disabled={addDiscount.isPending}
          className="bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 px-6"
        >
          {addDiscount.isPending ? "Adding…" : "Add Discount"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
