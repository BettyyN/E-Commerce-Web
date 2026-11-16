import { useState, useMemo } from "react";
import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { Badge } from "@/components/shared/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/ui/popover";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { Pagination } from "@/components/shared/ui/pagination";
import { TableToolbar } from "@/components/shared/TableToolbar";
import { useResettablePage } from "@/lib/tableFilters";
import { Plus, Edit, Trash2, MoreVertical, X, Power } from "lucide-react";
import { toast } from "sonner";
import {
  useMeasTypes,
  useAddMeasType,
  useUpdateMeasType,
  useChangeMeasTypeStat,
  useDeleteMeasType,
} from "@/service/measType/measType.queries";
import type { MeasTypeListDto } from "@/types/measType";

const ITEMS_PER_PAGE = 5;

export function MeasTypesManagement() {
  const { data: items = [], isLoading } = useMeasTypes();
  const addMeasType = useAddMeasType();
  const updateMeasType = useUpdateMeasType();
  const changeStat = useChangeMeasTypeStat();
  const deleteMeasType = useDeleteMeasType();

  // add / edit share the same top form
  const [editingItem, setEditingItem] = useState<MeasTypeListDto | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const [deleteItem, setDeleteItem] = useState<MeasTypeListDto | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<MeasTypeListDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useResettablePage(
    searchQuery.trim().toLowerCase(),
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((m) =>
      [m.code, m.name, m.status].some((v) => (v ?? "").toLowerCase().includes(q)),
    );
  }, [items, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [filtered, currentPage],
  );

  const isActive = (m: MeasTypeListDto) => m.status === "Active";

  const resetForm = () => {
    setEditingItem(null);
    setCode("");
    setName("");
  };

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

  const startEdit = (item: MeasTypeListDto) => {
    setEditingItem(item);
    setCode(item.code);
    setName(item.name);
  };

  const handleSubmit = async () => {
    if (!code.trim() || !name.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingItem) {
        const message = await updateMeasType.mutateAsync({
          id: editingItem.id,
          code: code.trim().toUpperCase(),
          name: name.trim(),
        });
        toast.success(message ?? "Measurement type updated");
      } else {
        const message = await addMeasType.mutateAsync({
          code: code.trim().toUpperCase(),
          name: name.trim(),
        });
        toast.success(message ?? "Measurement type added");
      }
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save measurement type");
    }
  };

  if (isLoading) {
    return (
      <Card className="p-10 text-center text-brown-500">
        Loading measurement types…
      </Card>
    );
  }

  const isPending = addMeasType.isPending || updateMeasType.isPending;

  return (
    <>
      <Card className="p-6">
        <h2 className="text-xl font-bold text-brown-900">
          Measurement Types
          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 font-semibold px-1.5 py-0.5 rounded-full align-middle">
            {items.length}
          </span>
        </h2>

        {/* Add / Edit form */}
        <div className="p-4 border border-brown-200 rounded-lg bg-brown-50">
          {editingItem && (
            <p className="text-xs font-semibold text-yellow-700 mb-2">
              Editing:{" "}
              <span className="text-brown-800">{editingItem.name}</span>
            </p>
          )}
          <div className="flex flex-col md:flex-row gap-3 items-end">
            <div className="space-y-1.5 w-32">
              <Label>Code</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="KG"
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kilogram"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            <div className="flex gap-2">
              {editingItem && (
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
                {editingItem ? (
                  isPending ? (
                    "Saving…"
                  ) : (
                    "Save Changes"
                  )
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search measurement types..."
        />

        {/* Table */}
        <div className="w-full lg:w-2/3 border border-brown-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-brown-100">
              <tr>
                <th className="text-left p-4 text-brown-900 font-semibold">
                  Code
                </th>
                <th className="text-left p-4 text-brown-900 font-semibold">
                  Name
                </th>
                <th className="text-left p-4 text-brown-900 font-semibold">
                  Status
                </th>
                <th className="text-right p-4 text-brown-900 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-sm text-slate-400"
                  >                    {searchQuery.trim()
                      ? "No measurement types match your search."
                      : "No measurement types yet"}
                    </td>
                </tr>
              )}
              {paginated.map((item) => (
                <tr
                  key={item.id}
                  className={`border-t border-brown-200 hover:bg-brown-50 ${editingItem?.id === item.id ? "bg-yellow-50" : ""}`}
                >
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-yellow-100 text-yellow-800 text-sm font-mono font-semibold">
                      {item.code}
                    </span>
                  </td>
                  <td className="p-4 text-brown-900">{item.name}</td>
                  <td className="p-4">
                    <Badge
                      className={
                        isActive(item)
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-brown-700 hover:bg-yellow-50"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-2" align="end">
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(item)}
                              className="justify-start gap-2 font-normal text-brown-700 hover:bg-yellow-50"
                            >
                              <Edit className="h-4 w-4" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setStatusTarget(item)}
                              className="justify-start gap-2 font-normal text-brown-700 hover:bg-yellow-50"
                            >
                              <Power className="h-4 w-4" />
                              {isActive(item) ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeleteItem(item);
                                setDeleteOpen(true);
                              }}
                              className="justify-start gap-2 font-normal text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filtered.length}
          />
        </div>
      </Card>

      <DeleteConfirmationModal
        open={!!statusTarget}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
        title="Change Measurement Type Status"
        description={`Are you sure you want to ${
          statusTarget && isActive(statusTarget) ? "deactivate" : "activate"
        } "${statusTarget?.name}"?`}
        confirmLabel="Confirm"
        onConfirm={handleStatusConfirm}
      />

      <DeleteConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Measurement Type"
        description={`Are you sure you want to delete "${deleteItem?.name}"?`}
        onConfirm={async () => {
          if (!deleteItem) return;
          try {
            const message = await deleteMeasType.mutateAsync(deleteItem.id);
            toast.success(message ?? "Measurement type deleted");
            setDeleteItem(null);
            setDeleteOpen(false);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete measurement type");
          }
        }}
      />
    </>
  );
}
