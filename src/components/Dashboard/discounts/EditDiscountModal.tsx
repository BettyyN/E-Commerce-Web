import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { DiscountTypes } from "@/types/enum";
import { useUpdateProDiscount } from "@/service/proDiscnt/proDiscnt.queries";
import { toUtcIso } from "@/lib/utils";
import type {
  ProDiscntListDto,
  VarDiscntListDto,
} from "@/types/productDiscount";

const today = new Date().toISOString().split("T")[0];

const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

const discountTypeOptions = Object.entries(DiscountTypes);

const PERCENTAGE_KEY = discountTypeOptions.find(
  ([, label]) => label === "Percentage",
)?.[0];

const getDiscountTypeLabel = (type: string) =>
  DiscountTypes[type as keyof typeof DiscountTypes] ?? type;

type AnyDiscountDto = ProDiscntListDto | VarDiscntListDto;

interface EditDiscountModalProps {
  item: AnyDiscountDto | null;
  onClose: () => void;
}

export function EditDiscountModal({
  item,
  onClose,
}: EditDiscountModalProps) {
  const updateDiscount = useUpdateProDiscount();

  const [value, setValue] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(nextMonth);

  useEffect(() => {
    if (!item) return;

    setValue(item.valueStr.replace(/[^\d.]/g, ""));
    setStartDate(item.startDateAt?.split("T")[0] ?? today);
    setEndDate(item.endDateAt?.split("T")[0] ?? nextMonth);
  }, [item]);

  const handleSave = async () => {
    if (!item) return;

    if (!startDate || !endDate) {
      toast.error("Please provide start and end dates");
      return;
    }

    const val = parseFloat(value);

    if (isNaN(val) || val <= 0) {
      toast.error("Value must be positive");
      return;
    }

    if (String(item.type) === PERCENTAGE_KEY && val >= 100) {
      toast.error("Percentage must be below 100");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      const startDateUtc = toUtcIso(startDate);
      const endDateUtc = toUtcIso(endDate);

      if (!startDateUtc || !endDateUtc) {
        toast.error("Please provide valid start and end dates.");
        return;
      }

      const message = await updateDiscount.mutateAsync({
        id: item.id,
        type: String(item.type),
        value: val,
        startDate: startDateUtc,
        endDate: endDateUtc,
      });

      toast.success(message ?? "Discount updated");
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update discount",
      );
    }
  };

  const variantLabel =
    "variant" in (item ?? {})
      ? (item as ProDiscntListDto).variant
      : undefined;

  const typeLabel = getDiscountTypeLabel(String(item?.type ?? ""));

  const displayType =
    typeLabel === "Percentage"
      ? "Percentage (%)"
      : typeLabel === "Fixed"
        ? "Fixed (ETB)"
        : typeLabel;

  return (
    <Modal
      open={!!item}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalHeader>
        <ModalTitle>Edit Discount</ModalTitle>
      </ModalHeader>

      <ModalBody>
        <div className="grid grid-cols-2 gap-4">
          {variantLabel && (
            <div className="col-span-2 space-y-1.5">
              <Label>Variant</Label>
              <Input
                value={variantLabel}
                disabled
                className="bg-slate-50"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Type</Label>
            <Input
              value={displayType}
              disabled
              className="bg-slate-50"
            />
          </div>

          <div className="space-y-1.5">
            <Label>
              Value <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={String(item?.type) === PERCENTAGE_KEY ? "10" : "5.00"}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label>
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>
              End Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          variant="outline"
          onClick={onClose}
          className="border-brown-300 text-brown-700 hover:bg-yellow-50 px-6"
        >
          Cancel
        </Button>

        <Button
          onClick={handleSave}
          disabled={updateDiscount.isPending}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 px-6"
        >
          {updateDiscount.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
