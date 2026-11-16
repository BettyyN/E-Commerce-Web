import { useState, useRef, useEffect, useMemo } from "react";
import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { Badge } from "@/components/shared/ui/badge";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { TableToolbar } from "@/components/shared/TableToolbar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/ui/popover";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  ImagePlus,
  X,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  useBanks,
  useAddBank,
  useUpdateBank,
  useChangeBankStat,
  useDeleteBank,
  useBankIcon,
} from "@/service/bank/bank.queries";
import type { BankListDto, BankAddDto, BankModDto } from "@/types/bank";

const MAX_ICON_SIZE = 2 * 1024 * 1024;

// ── Existing icon (fetched by id, same idea as ProImageThumb) ─────────────────
function ExistingBankIcon({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const { data: url } = useBankIcon(id);
  if (!url) {
    return (
      <div
        className={`${className ?? ""} bg-slate-100 flex items-center justify-center`}
      >
        <Building2 className="h-5 w-5 text-slate-400" />
      </div>
    );
  }
  return <img src={url} alt="Bank logo" className={className} />;
}

// ── Icon picker: keeps the real File, preview via object URL ──────────────────
function BankIconPicker({
  file,
  existingBankId,
  onChange,
  required,
}: {
  file: File | null;
  existingBankId?: string;
  onChange: (file: File | null) => void;
  required?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Build / revoke the object URL whenever the selected file changes
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    // allow selecting the same file again later
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (f.size > MAX_ICON_SIZE) {
      toast.error("Image must be under 2 MB");
      return;
    }
    onChange(f);
  };

  const hasImage = !!preview || !!existingBankId;

  return (
    <div className="space-y-1.5">
      <Label>
        Bank Logo {required && <span className="text-red-500">*</span>}
      </Label>
      <div
        onClick={() => fileRef.current?.click()}
        className={`flex items-center gap-4 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          file
            ? "border-yellow-400 bg-yellow-50/30"
            : "border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/30"
        }`}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="New logo"
              className="h-12 w-24 object-contain rounded"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="absolute -top-1 -right-1 h-4 w-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        ) : existingBankId ? (
          <ExistingBankIcon
            id={existingBankId}
            className="h-12 w-24 object-contain rounded"
          />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
            <ImagePlus className="h-5 w-5 text-slate-400" />
          </div>
        )}
        <div>
          <p className="text-sm text-slate-600 font-medium">
            {hasImage ? "Change image" : "Upload bank logo"}
          </p>
          <p className="text-xs text-slate-400">
            {file ? file.name : "PNG, JPG, SVG up to 2 MB"}
          </p>
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

// ── Inline add / edit form ────────────────────────────────────────────────────
function BankForm({
  editingBank,
  onCancelEdit,
}: {
  editingBank: BankListDto | null;
  onCancelEdit: () => void;
}) {
  const addBank = useAddBank();
  const updateBank = useUpdateBank();

  const [bankName, setBankName] = useState("");
  const [acctHolder, setAcctHolder] = useState("");
  const [acctNum, setAcctNum] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);

  useEffect(() => {
    if (editingBank) {
      setBankName(editingBank.name);
      setAcctHolder(editingBank.acctHolder);
      setAcctNum(editingBank.acctNum);
    } else {
      setBankName("");
      setAcctHolder("");
      setAcctNum("");
    }
    setIconFile(null);
  }, [editingBank]);

  const resetForm = () => {
    setBankName("");
    setAcctHolder("");
    setAcctNum("");
    setIconFile(null);
    onCancelEdit();
  };

  const handleSubmit = async () => {
    if (!bankName.trim() || !acctHolder.trim() || !acctNum.trim()) {
      toast.error("Bank name, account holder, and account number are required");
      return;
    }

    if (editingBank) {
      const payload: BankModDto = {
        id: editingBank.id,
        name: bankName.trim(),
        acctHolder: acctHolder.trim(),
        acctNum: acctNum.trim(),
        icon: iconFile ?? undefined, // File only when a new one was picked
      };
      try {
        const message = await updateBank.mutateAsync(payload);
        toast.success(message ?? "Bank updated");
        resetForm();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update bank");
      }
    } else {
      if (!iconFile) {
        toast.error("Please upload a bank icon");
        return;
      }
      const payload: BankAddDto = {
        name: bankName.trim(),
        acctHolder: acctHolder.trim(),
        acctNum: acctNum.trim(),
        icon: iconFile,
      };
      try {
        const message = await addBank.mutateAsync(payload);
        toast.success(message ?? "Bank account added");
        resetForm();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add bank");
      }
    }
  };

  const isPending = addBank.isPending || updateBank.isPending;

  return (
    <div className="p-4 border border-brown-200 rounded-lg bg-brown-50 space-y-4">
      {editingBank && (
        <p className="text-xs font-semibold text-yellow-700">
          Editing: <span className="text-brown-800">{editingBank.name}</span>
        </p>
      )}

      <BankIconPicker
        file={iconFile}
        existingBankId={editingBank?.id}
        onChange={setIconFile}
        required={!editingBank}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label>
            Bank Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="e.g. Commercial Bank of Ethiopia"
          />
        </div>
        <div className="space-y-1.5">
          <Label>
            Account Holder <span className="text-red-500">*</span>
          </Label>
          <Input
            value={acctHolder}
            onChange={(e) => setAcctHolder(e.target.value)}
            placeholder="e.g. STOCK UP PLC"
          />
        </div>
        <div className="space-y-1.5">
          <Label>
            Account Number <span className="text-red-500">*</span>
          </Label>
          <Input
            value={acctNum}
            onChange={(e) => setAcctNum(e.target.value)}
            placeholder="e.g. 1000123456789"
          />
        </div>
      </div>

      <div className="flex gap-2">
        {editingBank && (
          <Button
            variant="outline"
            onClick={resetForm}
            className="border-brown-300 text-brown-700 hover:bg-yellow-50"
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
        >
          {editingBank ? (
            isPending ? (
              "Saving…"
            ) : (
              "Save Changes"
            )
          ) : isPending ? (
            "Adding…"
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" /> Add Bank
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ── Bank logo (card) ──────────────────────────────────────────────────────────
function BankLogo({ bank }: { bank: BankListDto }) {
  const { data: iconUrl } = useBankIcon(bank.id);
  return iconUrl ? (
    <img
      src={iconUrl}
      alt={bank.name}
      className="max-h-12 max-w-[120px] object-contain"
    />
  ) : (
    <div className="h-12 w-12 rounded-lg bg-yellow-50 flex items-center justify-center">
      <Building2 className="h-6 w-6 text-yellow-600" />
    </div>
  );
}

// ── Main bank management component ───────────────────────────────────────────
export function BankManagement() {
  const { data: banks = [], isLoading } = useBanks();
  const changeStat = useChangeBankStat();
  const deleteBank = useDeleteBank();

  const [editingBank, setEditingBank] = useState<BankListDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BankListDto | null>(null);
  const [statusTarget, setStatusTarget] = useState<BankListDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBanks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return banks;
    return banks.filter((b) =>
      [b.name, b.acctHolder, b.acctNum, b.status].some((v) =>
        (v ?? "").toLowerCase().includes(q),
      ),
    );
  }, [banks, searchQuery]);

  const isActive = (b: BankListDto) => b.status === "Active";

  const handleStatusConfirm = async () => {
    if (!statusTarget) return;
    try {
      const message = await changeStat.mutateAsync({
        id: statusTarget.id,
        stat: !isActive(statusTarget),
      });
      toast.success(
        message ??
          `"${statusTarget.name}" ${isActive(statusTarget) ? "deactivated" : "activated"}`,
      );
      setStatusTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  if (isLoading)
    return (
      <Card className="p-10 text-center text-brown-500">Loading banks…</Card>
    );

  return (
    <div className="space-y-5">
      <p className="text-sm text-brown-600">
        Payment bank accounts shown to customers at checkout
      </p>

      <BankForm
        editingBank={editingBank}
        onCancelEdit={() => setEditingBank(null)}
      />

      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search banks..."
      />

      {banks.length === 0 ? (
        <Card className="p-10 text-center">
          <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No bank accounts yet</p>
          <p className="text-sm text-slate-400">
            Fill in the form above to add one.
          </p>
        </Card>
      ) : filteredBanks.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-slate-400">
            No bank accounts match your search.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBanks.map((bank) => (
            <Card
              key={bank.id}
              className={`p-5 relative transition-all ${!isActive(bank) ? "opacity-60" : ""} ${editingBank?.id === bank.id ? "ring-2 ring-yellow-400" : ""}`}
            >
              <div className="absolute top-3 right-10">
                <Badge
                  className={
                    isActive(bank)
                      ? "bg-green-100 text-green-700 text-xs"
                      : "bg-slate-100 text-slate-500 text-xs"
                  }
                >
                  {bank.status}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-brown-500 hover:bg-yellow-50"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-1" align="end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingBank(bank)}
                      className="w-full justify-start gap-2 text-sm font-normal text-brown-700 hover:bg-yellow-50"
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStatusTarget(bank)}
                      className="w-full justify-start gap-2 text-sm font-normal text-brown-700 hover:bg-yellow-50"
                    >
                      {isActive(bank) ? (
                        <>
                          <ToggleLeft className="h-4 w-4" /> Deactivate
                        </>
                      ) : (
                        <>
                          <ToggleRight className="h-4 w-4" /> Activate
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(bank)}
                      className="w-full justify-start gap-2 text-sm font-normal text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="h-14 flex items-center mb-4">
                <BankLogo bank={bank} />
              </div>

              <div className="space-y-1.5">
                <p className="font-semibold text-brown-900 text-sm">
                  {bank.name}
                </p>
                <div>
                  <p className="text-xs text-slate-400">Account Holder</p>
                  <p className="text-sm text-brown-700 font-medium">
                    {bank.acctHolder}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Account Number</p>
                  <p className="font-mono text-sm font-bold text-yellow-700 tracking-wider">
                    {bank.acctNum}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <DeleteConfirmationModal
        open={!!statusTarget}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
        title="Change Bank Status"
        description={`Are you sure you want to ${
          statusTarget && isActive(statusTarget) ? "deactivate" : "activate"
        } "${statusTarget?.name}"?`}
        confirmLabel="Confirm"
        onConfirm={handleStatusConfirm}
      />

      <DeleteConfirmationModal
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Bank Account"
        description={`Remove "${deleteTarget?.name}" from your payment options? This cannot be undone.`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            const message = await deleteBank.mutateAsync(deleteTarget.id);
            toast.success(message ?? "Bank deleted");
            setDeleteTarget(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete bank");
          }
        }}
      />
    </div>
  );
}
