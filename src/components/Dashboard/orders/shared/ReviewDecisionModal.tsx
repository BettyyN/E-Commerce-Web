import { Button } from "@/components/shared/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface ReviewDecisionModalProps {
  title: string;
  subtitle?: string;
  choice: "approve" | "reject";
  onChoiceChange: (c: "approve" | "reject") => void;
  approveLabel?: string;
  rejectLabel?: string;
  approveDesc?: string;
  rejectDesc?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
  extra?: React.ReactNode;
}

export function ReviewDecisionModal({
  title,
  subtitle,
  choice,
  onChoiceChange,
  approveLabel = "Approve",
  rejectLabel = "Reject",
  approveDesc,
  rejectDesc,
  onConfirm,
  onCancel,
  isPending,
  extra,
}: ReviewDecisionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-base font-semibold text-brown-900 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-brown-400 mb-4">{subtitle}</p>}

        {extra && <div className="mb-4">{extra}</div>}

        <div className="space-y-2.5 mb-5">
          <label
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${choice === "approve" ? "border-green-400 bg-green-50" : "border-slate-200 hover:border-slate-300"}`}
          >
            <input
              type="radio"
              name="decision"
              value="approve"
              checked={choice === "approve"}
              onChange={() => onChoiceChange("approve")}
              className="accent-green-500"
            />
            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-brown-900">
                {approveLabel}
              </p>
              {approveDesc && (
                <p className="text-xs text-brown-400">{approveDesc}</p>
              )}
            </div>
          </label>
          <label
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${choice === "reject" ? "border-red-400 bg-red-50" : "border-slate-200 hover:border-slate-300"}`}
          >
            <input
              type="radio"
              name="decision"
              value="reject"
              checked={choice === "reject"}
              onChange={() => onChoiceChange("reject")}
              className="accent-red-500"
            />
            <XCircle className="h-4 w-4 text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-brown-900">
                {rejectLabel}
              </p>
              {rejectDesc && (
                <p className="text-xs text-brown-400">{rejectDesc}</p>
              )}
            </div>
          </label>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-brown-300 text-brown-700"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className={
              choice === "approve"
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
                : "bg-red-500 hover:bg-red-600 text-white"
            }
          >
            {isPending
              ? "Submitting…"
              : `Confirm ${choice === "approve" ? approveLabel : rejectLabel}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
