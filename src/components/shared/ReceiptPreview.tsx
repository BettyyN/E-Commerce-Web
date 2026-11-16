import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog";
import { Loader2, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useOrderReceipt } from "@/service/pay/pay.queries";

/* Sniffs the blob type once and renders an <img> or <iframe> accordingly */
export function ReceiptContent({ url }: { url: string }) {
  const [kind, setKind] = useState<"image" | "pdf" | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        if (!cancelled) setKind(blob.type.startsWith("image/") ? "image" : "pdf");
      })
      .catch(() => {
        if (!cancelled) setKind("pdf");
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (kind === null) {
    return (
      <div className="flex items-center justify-center py-12 text-brown-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (kind === "image") {
    return (
      <img
        src={url}
        alt="Receipt"
        className="w-full rounded-xl border border-slate-100 bg-slate-50 object-contain max-h-[60vh]"
      />
    );
  }

  return (
    <iframe
      src={url}
      title="Receipt"
      className="w-full h-[60vh] rounded-xl border border-slate-100"
    />
  );
}

interface ReceiptPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /* Payment id — the mock (and backend) key the order receipt by payment id */
  paymentId: string;
  title?: string;
}

/* Renders an uploaded receipt (image inline, PDF in an iframe) */
export function ReceiptPreview({
  open,
  onOpenChange,
  paymentId,
  title = "Payment Receipt",
}: ReceiptPreviewProps) {
  const {
    data: url,
    isLoading,
    error,
  } = useOrderReceipt(open ? paymentId : undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-brown-900">
            {title}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-brown-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">Loading receipt…</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-red-500">
            <FileText className="h-6 w-6" />
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {url && <ReceiptContent url={url} />}
      </DialogContent>
    </Dialog>
  );
}
