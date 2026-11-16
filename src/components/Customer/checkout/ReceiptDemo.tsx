import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import OrderReceipt from "./OrderReceipt";

const company = {
  name: "STOCK UP PLC",
  address: "Bole, Addis Ababa, Ethiopia",
  phone: "+251 911 000 000",
  tin: "0041143838",
  stampImageUrl: "/assets/company-stamp.png",
};

const sampleOrder = {
  id: "ORD-000512",
  reference: "CSI-ST1-01-0000505",
  date: new Date().toLocaleString(),
  customerName: "Henok Zekaryas Eshet",
  customerPhone: "0925904212",
  customerAddress: "Bole, Addis Ababa",
  paymentMethod: "Bank Transfer",
  preparedBy: "System",
  vatRate: 0.15,
  grandTotal: 0, // computed from items
  items: [
    { id: "00001", name: "Wireless Headphones", quantity: 1, unitPrice: 45.0 },
    { id: "00002", name: "USB-C Cable", quantity: 2, unitPrice: 7.5 },
  ],
};

export default function ReceiptDemo() {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `receipt-${sampleOrder.id}`,
  });

  return (
    <div className="p-4">
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-yellow-500 text-brown-900 font-semibold rounded-lg hover:bg-yellow-600"
      >
        Print / Save Receipt
      </button>
      <OrderReceipt
        ref={receiptRef}
        company={company}
        order={sampleOrder}
        watermarkText="Paid"
      />
    </div>
  );
}
