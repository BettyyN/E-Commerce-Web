import { forwardRef } from "react";

export interface ReceiptItem {
  id: string | number;
  name: string;
  code?: string; // only rendered if any item has one
  quantity: number;
  unit?: string;
  unitPrice: number;
}

export interface ReceiptOrder {
  id: string;
  reference: string; // human-readable order number, shown as "Order No"
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerTin?: string;
  paymentMethod: string;
  preparedBy: string;
  items: ReceiptItem[];
  grandTotal: number;
  vatRate?: number;
  vat?: number;

  shopStore?: string;
  salesAgent?: string;
  fsNo?: string;
  amountInWords?: string;
  memo?: string;
  checkedBy?: string;
  approvedBy?: string;
  receivedBy?: string;
  footerNote?: string;
  systemByText?: string;
  thankYouText?: string;
  documentCode?: string;
}

export interface ReceiptCompany {
  name: string;
  address?: string; // optional single line under the name
  phone: string; // shown as Tel. 1
  tin: string;

  subCity?: string;
  kebele?: string;
  phone2?: string; // Tel. 2
  bldgNo?: string; // Bldg/H.No.
  fax?: string;
  vatRegNo?: string;
  copyLabel?: string; // e.g. "CUSTOMER COPY"
}

interface OrderReceiptProps {
  company: ReceiptCompany;
  order: ReceiptOrder;
  watermarkText?: string;
  title?: string;
}

const OrderReceipt = forwardRef<HTMLDivElement, OrderReceiptProps>(
  function OrderReceipt(
    {
      company,
      order,
      watermarkText = "ATTACHMENT",
      title = "CASH Sales Attachment",
    },
    ref,
  ) {
    const items = order.items ?? [];
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const vat = order.vatRate
      ? subtotal * order.vatRate
      : (order.vat ?? Math.round(subtotal * 0.08));
    const grandTotal =
      order.grandTotal && order.grandTotal > 0
        ? order.grandTotal
        : subtotal + vat;

    const fmt = (n: number) =>
      n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const hasItemCodes = items.some((item) => !!item.code);

    return (
      <div
        ref={ref}
        className="relative mx-auto w-full min-h-[297mm] box-border overflow-hidden bg-white p-[16mm] font-serif text-neutral-900 print:w-full print:min-h-0 print:shadow-none"
      >
        {/* Watermark */}
        <div className="pointer-events-none absolute left-1/2 top-[40%] z-0 -translate-x-1/2 -translate-y-1/2 -rotate-28 select-none whitespace-nowrap text-[80px] font-bold uppercase tracking-widest text-green-700/20">
          {watermarkText}
        </div>

        <div className="relative z-10">
          {/* Header — name on top, details in a row, title centered below */}
          <header className="mb-3">
            <h1 className="m-0 text-center text-xl font-bold uppercase tracking-wide">
              {company.name}
            </h1>
            {company.address && (
              <p className="m-0 mt-0.5 text-center text-xs text-neutral-600">
                {company.address}
              </p>
            )}

            <div className="mt-3 grid grid-cols-3 gap-x-4 border-b-2 border-neutral-900 pb-1.5 text-[10px] font-semibold leading-snug">
              <div className="space-y-0.5">
                <p className="m-0">Sub City : {company.subCity}</p>
                <p className="m-0">Tel. 1 : {company.phone}</p>
                <p className="m-0">TIN: {company.tin}</p>
                {company.copyLabel && (
                  <p className="m-0 italic underline">{company.copyLabel}</p>
                )}
              </div>
              <div className="space-y-0.5">
                <p className="m-0">Kebele: {company.kebele}</p>
                <p className="m-0">Tel. 2 : {company.phone2}</p>
                <p className="m-0">VAT Reg. No. : {company.vatRegNo}</p>
              </div>
              <div className="space-y-0.5">
                <p className="m-0">Bldg/H.No. : {company.bldgNo}</p>
                <p className="m-0">Fax: {company.fax}</p>
              </div>
            </div>

            <h2 className="m-0 mt-3 text-center text-sm font-bold">{title}</h2>
          </header>


          {/* Meta */}
          <div className="mb-4 flex gap-3">
            <table className="w-full flex-[2] border-collapse text-xs">
              <tbody>
                {(
                  [
                    ["Bill to", order.customerName],
                    ["Phone", order.customerPhone],
                    ...(order.customerTin
                      ? ([["TIN", order.customerTin]] as [string, string][])
                      : []),
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <tr key={label}>
                    <th className="w-[110px] border border-neutral-400 bg-neutral-100 p-1.5 px-2 text-left font-semibold">
                      {label}
                    </th>
                    <td className="border border-neutral-400 p-1.5 px-2 text-left">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table className="w-full flex-1 self-start border-collapse text-xs">
              <tbody>
                {(
                  [
                    ["Date", order.date],
                    ["Order No", order.reference || order.id],
                    ...(order.fsNo
                      ? ([["Fs No", order.fsNo]] as [string, string][])
                      : []),
                    ["Payment", order.paymentMethod],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <tr key={label}>
                    <th className="w-[110px] border border-neutral-400 bg-neutral-100 p-1.5 px-2 text-left font-semibold">
                      {label}
                    </th>
                    <td className="border border-neutral-400 p-1.5 px-2 text-left">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Items table — unchanged */}
          <table className="mb-3 w-full border-collapse text-xs">
            <thead>
              <tr>
                {[
                  "Description",
                  ...(hasItemCodes ? ["Code"] : []),
                  "Qty",
                  "Unit",
                  "Unit Price",
                  "Line Total",
                ].map((h) => (
                  <th
                    key={h}
                    className="border border-neutral-400 bg-neutral-200 p-1.5 px-2 text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={hasItemCodes ? 6 : 5}
                    className="border border-neutral-400 p-3 text-center text-neutral-400"
                  >
                    No items
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-neutral-400 p-1.5 px-2">
                      {item.name}
                    </td>
                    {hasItemCodes && (
                      <td className="border border-neutral-400 p-1.5 px-2 text-center">
                        {item.code ?? "-"}
                      </td>
                    )}
                    <td className="border border-neutral-400 p-1.5 px-2 text-right">
                      {item.quantity}
                    </td>
                    <td className="border border-neutral-400 p-1.5 px-2 text-center">
                      {item.unit ?? "-"}
                    </td>
                    <td className="border border-neutral-400 p-1.5 px-2 text-right">
                      {fmt(item.unitPrice)}
                    </td>
                    <td className="border border-neutral-400 p-1.5 px-2 text-right">
                      {fmt(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Totals — unchanged */}
          <div className="mb-6 flex justify-end">
            <table className="w-[260px] border-collapse text-xs">
              <tbody>
                <tr>
                  <th className="border border-neutral-400 bg-neutral-100 p-1.5 px-2.5 text-left">
                    Subtotal
                  </th>
                  <td className="border border-neutral-400 p-1.5 px-2.5 text-right">
                    {fmt(subtotal)}
                  </td>
                </tr>
                <tr>
                  <th className="border border-neutral-400 bg-neutral-100 p-1.5 px-2.5 text-left">
                    VAT (8%)
                  </th>
                  <td className="border border-neutral-400 p-1.5 px-2.5 text-right">
                    {fmt(vat)}
                  </td>
                </tr>
                <tr>
                  <th className="border border-neutral-400 bg-neutral-100 p-1.5 px-2.5 text-left text-[13px] font-bold">
                    Grand Total
                  </th>
                  <td className="border border-neutral-400 p-1.5 px-2.5 text-right text-[13px] font-bold">
                    {fmt(grandTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {order.amountInWords && (
            <p className="mb-4 text-xs">
              <span className="font-semibold">Total Amount In Words: </span>
              {order.amountInWords}
            </p>
          )}

          <p className="mb-4 border-b border-neutral-400 pb-6 text-xs">
            I received the above goods/services in good condition.
          </p>

          <div className="mb-6 flex items-center gap-2 text-xs">
            <span className="whitespace-nowrap font-semibold">
              Memo / Note:
            </span>
            <span className="flex-1 border-b border-dotted border-neutral-400 pb-0.5">
              {order.memo}
            </span>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-x-10 gap-y-5 text-xs">
            <div>
              <span className="font-semibold">Prepared By: </span>
              {order.preparedBy}
            </div>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap font-semibold">
                Checked By:
              </span>
              <span className="flex-1 border-b border-neutral-400 pb-0.5">
                {order.checkedBy}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap font-semibold">
                Approved By:
              </span>
              <span className="flex-1 border-b border-neutral-400 pb-0.5">
                {order.approvedBy}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap font-semibold">
                Received By:
              </span>
              <span className="flex-1 border-b border-neutral-400 pb-0.5">
                {order.receivedBy}
              </span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <span className="whitespace-nowrap font-semibold">
                Signature:
              </span>
              <span className="flex-1 border-b border-neutral-400 pb-0.5" />
            </div>
          </div>

          <p className="mb-2 border-t border-dashed border-neutral-400 pt-3 text-center text-xs font-semibold">
            {order.footerNote ??
              "This receipt is not valid unless the fiscal receipt is attached!"}
          </p>

          <p className="mb-3 text-center text-[10px] text-neutral-500">
            {order.thankYouText ?? "Thank you! please come again."}
          </p>

          {order.documentCode && (
            <p className="text-[10px] text-neutral-400">{order.documentCode}</p>
          )}
        </div>
      </div>
    );
  },
);

export default OrderReceipt;
