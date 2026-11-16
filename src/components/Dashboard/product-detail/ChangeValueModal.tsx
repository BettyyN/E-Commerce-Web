import { useState } from "react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { toast } from "sonner";
import { BTN_PRIMARY, BTN_OUTLINE } from "@/lib/utils";

export function ChangeValueModal({
  title,
  label,
  unit,
  current,
  onClose,
  onSave,
}: {
  title: string;
  label: string;
  unit?: string;
  current: number;
  onClose: () => void;
  onSave: (value: number) => void;
}) {
  const [value, setValue] = useState("");

  const handleSave = () => {
    const val = parseFloat(value);
    if (isNaN(val) || val < 0) {
      toast.error(`Enter a valid ${label.toLowerCase()}`);
      return;
    }
    onSave(val);
    setValue("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl space-y-4">
        <h3 className="text-base font-semibold text-brown-900">{title}</h3>
        <div className="space-y-1.5">
          <Label>
            {label} {unit && <span className="text-slate-400">({unit})</span>}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            step="0.01"
            min={0}
            placeholder={current.toString()}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
        </div>
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            onClick={onClose}
            className={`flex-1 ${BTN_OUTLINE}`}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className={`flex-1 ${BTN_PRIMARY}`}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
