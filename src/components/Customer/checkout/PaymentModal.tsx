import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog";
import { Button } from "@/components/shared/ui/button";
import { Label } from "@/components/shared/ui/label";
import { Textarea } from "@/components/shared/ui/textarea";
import {
  CheckCircle2,
  Loader2,
  Landmark,
  Banknote,
  ClipboardList,
  CreditCard,
  FileImage,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCheckoutPaid,
  useCheckoutCredit,
} from "@/service/checkout/checkout.queries";
import { useCartStore, type CartItem } from "@/store/cartStore";
import type { BankIconList } from "@/types/bank";
import { useBankIconNames, useNameListIcon } from "@/service/nameList/nameList.queries";
import { PayMethod as PayMethodEnum } from "@/types/enum";

// ── Bank tile ─────────────────────────────────────────────────────────────────
function BankTile({
  bank,
  selected,
  onSelect,
}: {
  bank: BankIconList;
  selected: boolean;
  onSelect: () => void;
}) {
  const { data: iconUrl } = useNameListIcon(bank.id);
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
        selected
          ? "border-yellow-500 bg-yellow-50 shadow-md"
          : "border-slate-200 hover:border-yellow-300 hover:bg-yellow-50/30"
      }`}
    >
      {iconUrl ? (
        <img
          src={iconUrl}
          alt={bank.name}
          className="max-h-10 max-w-20 object-contain"
        />
      ) : (
        <Landmark className="h-6 w-6 text-slate-300" />
      )}
      <span className="text-[11px] text-slate-500 text-center mt-1.5 leading-tight line-clamp-2">
        {bank.name}
      </span>
    </button>
  );
}

// ── File upload zone ──────────────────────────────────────────────────────────
function FileZone({
  label,
  file,
  preview,
  inputRef,
  onChange,
  onClear,
  required,
}: {
  label: string;
  file: File | null;
  preview: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
          file
            ? "border-yellow-400 bg-yellow-50/30"
            : "border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/20"
        }`}
      >
        {file ? (
          <>
            {preview ? (
              <img
                src={preview}
                alt="upload"
                className="max-h-28 rounded-lg object-contain"
              />
            ) : (
              <div className="flex items-center gap-2 py-2">
                <FileImage className="h-6 w-6 text-yellow-600" />
                <span className="text-sm font-medium text-brown-700">
                  {file.name}
                </span>
              </div>
            )}
            <p className="text-xs text-slate-400">{file.name}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="absolute top-2 right-2 h-6 w-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : (
          <>
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
              <FileImage className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600 font-medium">
              Click to upload
            </p>
            <p className="text-xs text-slate-400">PNG, JPG, PDF up to 10 MB</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={onChange}
        />
      </div>
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  onOrderPlaced: () => void;
}

type PayMode = "payment" | "credit";
type PayMethodKey = keyof typeof PayMethodEnum; // "0" | "1"
type Step = 1 | 2;

// ── Main modal ────────────────────────────────────────────────────────────────
export function PaymentModal({
  open,
  onOpenChange,
  total,
  onOrderPlaced,
}: PaymentModalProps) {
  const { data: banks = [] } = useBankIconNames();

  const checkoutPaid = useCheckoutPaid();
  const checkoutCredit = useCheckoutCredit();

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const orderItems = items.map((item: CartItem) => ({
    variantId: item.variantId,
    quantity: item.quantity,
  }));

  const [step, setStep] = useState<Step>(1);
  const [mode, setMode] = useState<PayMode>("payment");
  const [payMethod, setPayMethod] = useState<PayMethodKey>("0");
  const [selectedBank, setSelectedBank] = useState<BankIconList | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [creditRemark, setCreditRemark] = useState("");
  const [success, setSuccess] = useState(false);

  const receiptRef = useRef<HTMLInputElement>(null);
  const submitting = checkoutPaid.isPending || checkoutCredit.isPending;

  const reset = () => {
    setStep(1);
    setMode("payment");
    setPayMethod("0");
    setSelectedBank(null);
    setReceiptFile(null);
    setReceiptPreview(null);
    setCreditRemark("");
    setSuccess(false);
    checkoutPaid.reset();
    checkoutCredit.reset();
  };

  useEffect(() => {
    if (open) reset();
  }, [open]); // eslint-disable-line

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10 MB");
      return;
    }
    setReceiptFile(file);
    setReceiptPreview(
      file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    );
  };

  const handleSubmit = () => {
    if (mode === "credit") {
      if (!creditRemark.trim()) {
        toast.error("Please add a remark");
        return;
      }
      checkoutCredit.mutate(
        { remark: creditRemark.trim(), items: orderItems },
        {
          onSuccess: () => {
            clearCart();
            setSuccess(true);
          },
          onError: (err) => toast.error(err.message),
        },
      );
      return;
    }
    if (!selectedBank) {
      toast.error("Select a bank account");
      return;
    }
    if (payMethod === "0" && !receiptFile) {
      toast.error("Upload your transfer receipt");
      return;
    }
    if (payMethod === "1" && !receiptFile) {
      toast.error("Upload a cheque image or PDF");
      return;
    }

    checkoutPaid.mutate(
      {
        bankId: selectedBank.id,
        payMethod,
        receipt: receiptFile!,
        items: orderItems,
      },
      {
        onSuccess: () => {
          clearCart();
          setSuccess(true);
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v && !success) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto p-0">
        {success ? (
          <div className="px-6 py-12 flex flex-col items-center text-center gap-5">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brown-900">
                {mode === "credit"
                  ? "Credit Request Submitted!"
                  : "Order Placed!"}
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                {mode === "credit"
                  ? "Your request is under review. Track it from your dashboard."
                  : payMethod === "1"
                    ? "Your cheque details were submitted. We'll confirm your order shortly."
                    : "Your receipt was submitted. We'll verify and confirm shortly."}
              </p>
            </div>
            <Button
              onClick={() => {
                onOrderPlaced();
                onOpenChange(false);
              }}
              className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-semibold py-5"
            >
              Back to Shop
            </Button>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Header */}
            <DialogHeader className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-slate-400 hover:text-slate-700 shrink-0"
                  >
                    ←
                  </button>
                )}
                <div>
                  <DialogTitle className="text-base font-bold text-brown-900">
                    {step === 1
                      ? "Place Order"
                      : mode === "credit"
                        ? "Credit Request"
                        : "Payment Details"}
                  </DialogTitle>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Total:{" "}
                    <span className="font-semibold text-brown-900">
                      {total.toLocaleString()} ETB
                    </span>
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-5 space-y-5 overflow-y-auto">
              {/* ── Step 1: Order type ── */}
              {step === 1 && (
                <>
                  <p className="text-sm text-slate-500">
                    How would you like to place this order?
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setMode("payment")}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all group ${
                        mode === "payment"
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/40"
                      }`}
                    >
                      <div className="h-11 w-11 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
                        <Banknote className="h-5 w-5 text-yellow-700" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-brown-900 group-hover:text-yellow-700">
                          Pay Now
                        </p>
                        <p className="text-xs text-slate-500">
                          Bank transfer or cheque
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("credit")}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all group ${
                        mode === "credit"
                          ? "border-blue-400 bg-blue-50"
                          : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/40"
                      }`}
                    >
                      <div className="h-11 w-11 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <CreditCard className="h-5 w-5 text-blue-700" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-brown-900 group-hover:text-blue-700">
                          Request Credit
                        </p>
                        <p className="text-xs text-slate-500">
                          Place the order on credit — payment due later
                        </p>
                      </div>
                    </button>
                  </div>
                  <Button
                    onClick={() => setStep(2)}
                    className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-semibold py-5"
                  >
                    Continue →
                  </Button>
                </>
              )}

              {/* ── Step 2: Payment details ── */}
              {step === 2 && mode === "payment" && (
                <>
                  {/* Payment method */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Payment Method
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {(Object.entries(PayMethodEnum) as [PayMethodKey, string][]).map(
                        ([key, name]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setPayMethod(key);
                              setReceiptFile(null);
                              setReceiptPreview(null);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                              payMethod === key
                                ? "border-yellow-500 bg-yellow-50"
                                : "border-slate-200 hover:border-yellow-300"
                            }`}
                          >
                            <div
                              className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${key === "0" ? "bg-yellow-100" : "bg-purple-100"}`}
                            >
                              {key === "0" ? (
                                <Banknote className="h-5 w-5 text-yellow-700" />
                              ) : (
                                <ClipboardList className="h-5 w-5 text-purple-700" />
                              )}
                            </div>
                            <p className="text-sm font-semibold text-brown-900">
                              {name}
                            </p>
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Bank selection */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Select Bank <span className="text-red-500">*</span>
                    </Label>
                    {banks.length === 0 ? (
                      <p className="text-xs text-slate-400">
                        No active banks available.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {banks.map((b) => (
                          <BankTile
                            key={b.id}
                            bank={b}
                            selected={selectedBank?.id === b.id}
                            onSelect={() => setSelectedBank(b)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bank info pill */}
                  {selectedBank && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm">
                      <Landmark className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-brown-900">
                          {selectedBank.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Account:{" "}
                          <span className="font-mono font-bold text-yellow-700 tracking-widest">
                            {selectedBank.acctNum}
                          </span>
                        </p>
                        <p className="text-xs text-slate-400">
                          {selectedBank.acctHolder}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Receipt upload */}
                  <FileZone
                    label={
                      payMethod === "0"
                        ? "Transfer Receipt"
                        : "Cheque Image / PDF"
                    }
                    file={receiptFile}
                    preview={receiptPreview}
                    inputRef={receiptRef}
                    onChange={handleFile}
                    onClear={() => {
                      setReceiptFile(null);
                      setReceiptPreview(null);
                    }}
                    required
                  />

                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-semibold py-5"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Banknote className="h-4 w-4 mr-2" /> Place Order
                      </>
                    )}
                  </Button>
                </>
              )}

              {step === 2 && mode === "credit" && (
                <>
                  <div className="space-y-1.5">
                    <Label>
                      Remark / Reason <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      value={creditRemark}
                      onChange={(e) => setCreditRemark(e.target.value)}
                      placeholder="Explain why you're requesting credit..."
                      maxLength={500}
                      rows={5}
                    />
                    <p className="text-xs text-slate-400 text-right">
                      {creditRemark.length}/500
                    </p>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-semibold py-5"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                        Submitting…
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" /> Submit Credit
                        Request
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
