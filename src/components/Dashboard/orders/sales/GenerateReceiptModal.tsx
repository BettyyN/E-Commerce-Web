import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/shared/ui/button";
import { Printer, X } from "lucide-react";
import OrderReceipt, {
  type ReceiptCompany,
  type ReceiptOrder,
} from "@/components/Customer/checkout/OrderReceipt";

const COMPANY: ReceiptCompany = {
  name: "BIRHANU HAILEMARIAM ASFAW",
  address: "Addis Ketema, Addis Ababa, Ethiopia",
  phone: "+2519 11210968",
  tin: "0000120357",
  kebele: "01",
  bldgNo: "HNO",
 vatRegNo: "",
};

interface GenerateReceiptModalProps {
  open: boolean;
  onClose: () => void;
  order: ReceiptOrder;
}

export function GenerateReceiptModal({
  open,
  onClose,
  order,
}: GenerateReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `receipt-${order.id}`,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-brown-900">
            Order Receipt
          </h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-semibold"
            >
              <Printer className="h-4 w-4 mr-2" /> Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Receipt preview */}
        <div className="overflow-x-auto p-4 bg-slate-50">
          <OrderReceipt
            ref={receiptRef}
            company={COMPANY}
            order={order}
            // watermarkText={order.paymentMethod === "Credit" ? "Credit" : "Paid"}
            watermarkText={"Attachement"}
          />
        </div>
      </div>
    </div>
  );
}
