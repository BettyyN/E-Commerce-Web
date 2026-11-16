import { Button } from "@/components/shared/ui/button";
import { Loader2, Receipt } from "lucide-react";
import { ReceiptContent } from "@/components/shared/ReceiptPreview";
import { useOrderReceipt } from "@/service/pay/pay.queries";
import { useCreditReceipt } from "@/service/pay/pay.queries";

// ── Inline receipt using order payment id ────────────────────────────────────
export function EmbeddedOrderReceipt({ paymentId }: { paymentId?: string }) {
  const { data: url, isLoading, error } = useOrderReceipt(paymentId);

  if (!paymentId) return <EmptySlot />;
  if (isLoading) return <LoadingSlot />;
  if (error || !url) return <ErrorSlot />;
  return <ReceiptContent url={url} />;
}

// ── Inline receipt using credit payment id ───────────────────────────────────
export function EmbeddedCreditReceipt({ id }: { id: string }) {
  const { data: url, isLoading, error } = useCreditReceipt(id);

  if (isLoading) return <LoadingSlot />;
  if (error || !url) return <ErrorSlot />;
  return <ReceiptContent url={url} />;
}

// ── Receipt overlay shell ─────────────────────────────────────────────────────
interface ReceiptModalShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  onProceed?: () => void;
  proceedLabel?: string;
}

export function ReceiptModalShell({
  title,
  subtitle,
  children,
  onClose,
  onProceed,
  proceedLabel = "Proceed",
}: ReceiptModalShellProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-brown-900">{title}</h3>
          {subtitle && (
            <span className="text-xs text-brown-400">{subtitle}</span>
          )}
        </div>
        {children}
        <div className="flex justify-end gap-2 mt-5">
          {onProceed && (
            <Button
              onClick={onProceed}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
            >
              <Receipt className="h-4 w-4 mr-1" /> {proceedLabel}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
            className="border-brown-300 text-brown-700"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
      No receipt available
    </div>
  );
}
function LoadingSlot() {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-10 flex items-center justify-center text-brown-400">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  );
}
function ErrorSlot() {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
      Receipt could not be loaded
    </div>
  );
}
