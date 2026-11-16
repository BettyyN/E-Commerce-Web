import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog";
import { Button } from "@/components/shared/ui/button";
import { Label } from "@/components/shared/ui/label";
import {
  Loader2,
  Landmark,
  Wallet,
  Banknote,
  ClipboardList,
  FileImage,
  X,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { formatETB } from "@/lib/utils";
import type { BankIconList } from "@/types/bank";
import { PayMethod as PayMethodEnum } from "@/types/enum";
import { useNameListIcon } from "@/service/nameList/nameList.queries";

function BankOption({
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
      onClick={onSelect}
      className={`flex flex-col items-center p-2.5 rounded-xl border-2 transition-all ${
        selected
          ? "border-yellow-500 bg-yellow-50 shadow-md"
          : "border-slate-200 hover:border-yellow-300"
      }`}
    >
      {iconUrl ? (
        <img
          src={iconUrl}
          alt={bank.name}
          className="max-h-8 max-w-16 object-contain"
        />
      ) : (
        <Landmark className="h-5 w-5 text-slate-300" />
      )}
      <span className="text-[10px] text-slate-500 text-center mt-1 leading-tight line-clamp-2">
        {bank.name}
      </span>
    </button>
  );
}

export interface PayCreditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  remain: number;
  banks: BankIconList[];
  selectedBank: BankIconList | null;
  onSelectBank: (bank: BankIconList | null) => void;
  payMethod: keyof typeof PayMethodEnum;
  onPayMethodChange: (m: keyof typeof PayMethodEnum) => void;
  amount: string;
  onAmountChange: (value: string) => void;
  receipt: File | null;
  onReceiptChange: (file: File | null) => void;
  submitting: boolean;
  onSubmit: () => void;
}

export function PayCreditModal({
  open,
  onOpenChange,
  remain,
  banks,
  selectedBank,
  onSelectBank,
  payMethod,
  onPayMethodChange,
  amount,
  onAmountChange,
  receipt,
  onReceiptChange,
  submitting,
  onSubmit,
}: PayCreditModalProps) {
  const receiptRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10 MB");
      return;
    }
    onReceiptChange(file);
    setPreview(
      file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-brown-900">
            Pay Credit
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <span className="text-xs font-medium text-blue-700">
              Remaining balance
            </span>
            <span className="text-sm font-bold text-blue-900">
              {formatETB(remain)}
            </span>
          </div>

          <div className="space-y-1.5">
            <Label>
              Amount (ETB) <span className="text-red-500">*</span>
            </Label>
            <input
              type="number"
              step="0.01"
              min={0}
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="0.00"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Payment Method <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(PayMethodEnum) as [keyof typeof PayMethodEnum, string][]).map(
                ([key, name]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onPayMethodChange(key);
                      onReceiptChange(null);
                      setPreview(null);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      payMethod === key
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-slate-200 hover:border-yellow-300"
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${key === "0" ? "bg-yellow-100" : "bg-purple-100"}`}
                    >
                      {key === "0" ? (
                        <Banknote className="h-4 w-4 text-yellow-700" />
                      ) : (
                        <ClipboardList className="h-4 w-4 text-purple-700" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-brown-900">{name}</p>
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Bank Account <span className="text-red-500">*</span>
            </Label>
            {banks.length === 0 ? (
              <p className="text-xs text-slate-400">
                No active bank accounts available.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {banks.map((bank) => (
                  <BankOption
                    key={bank.id}
                    bank={bank}
                    selected={selectedBank?.id === bank.id}
                    onSelect={() => onSelectBank(bank)}
                  />
                ))}
              </div>
            )}
          </div>

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

          <div className="space-y-1.5">
            <Label>
              {payMethod === "0"
                ? "Transfer Receipt"
                : "Cheque Image / PDF"}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <div
              onClick={() => receiptRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                receipt
                  ? "border-yellow-400 bg-yellow-50/30"
                  : "border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/20"
              }`}
            >
              {receipt ? (
                <>
                  {preview ? (
                    <img
                      src={preview}
                      alt="receipt"
                      className="max-h-28 rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <FileImage className="h-6 w-6 text-yellow-600" />
                      <span className="text-sm font-medium text-brown-700">
                        {receipt.name}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-slate-400">{receipt.name}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReceiptChange(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 h-6 w-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 text-slate-400" />
                  <p className="text-sm text-slate-600 font-medium">
                    Click to upload
                  </p>
                  <p className="text-xs text-slate-400">
                    PNG, JPG, PDF up to 10 MB
                  </p>
                </>
              )}
              <input
                ref={receiptRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFile}
              />
            </div>
          </div>

          <Button
            onClick={onSubmit}
            disabled={submitting}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-semibold py-5"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" /> Submit Payment
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
