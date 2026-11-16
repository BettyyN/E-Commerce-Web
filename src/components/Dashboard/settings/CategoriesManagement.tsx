import { useState, useMemo } from "react";
import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Badge } from "@/components/shared/ui/badge";
import { Plus, Edit, Trash2, MoreVertical, Power, X } from "lucide-react";
import { Field, FieldLabel } from "@/components/shared/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/ui/popover";
import { Pagination } from "@/components/shared/ui/pagination";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { TableToolbar } from "@/components/shared/TableToolbar";
import { useResettablePage } from "@/lib/tableFilters";
import { toast } from "sonner";
import {
  useCategories,
  useAddCategory,
  useUpdateCategory,
  useChangeCategoryStat,
  useDeleteCategory,
} from "@/service/cat/cat.queries";
import type { CatListDto } from "@/types/category";
import {
  IconPicker,
  getCategoryIcon,
} from "@/components/shared/ui/icon-picker";

const ITEMS_PER_PAGE = 5;



export function CategoriesManagement() {
  const { data: categories = [], isLoading } = useCategories();
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const changeStat = useChangeCategoryStat();
  const deleteCategory = useDeleteCategory();

  const [editingItem, setEditingItem] = useState<CatListDto | null>(null);
  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("Package");
  const [deleteTarget, setDeleteTarget] = useState<CatListDto | null>(null);
  const [statusTarget, setStatusTarget] = useState<CatListDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useResettablePage(
    searchQuery.trim().toLowerCase(),
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) =>
      [c.name, c.status].some((v) => (v ?? "").toLowerCase().includes(q)),
    );
  }, [categories, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [filtered, currentPage],
  );

  const isActive = (c: CatListDto) => c.status === "Active";

  const resetForm = () => {
    setEditingItem(null);
    setFormName("");
    setFormIcon("Package");
  };

  const startEdit = (c: CatListDto) => {
    setEditingItem(c);
    setFormName(c.name);
    setFormIcon(c.icon);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    try {
      if (editingItem) {
        const message = await updateCategory.mutateAsync({
          id: editingItem.id,
          name: formName.trim(),
          icon: formIcon,
        });
        toast.success(message ?? "Category updated successfully!");
      } else {
        const message = await addCategory.mutateAsync({
          name: formName.trim(),
          icon: formIcon,
        });
        toast.success(message ?? "Category added successfully!");
      }
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save category");
    }
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

  if (isLoading) {
    return (
      <Card className="p-10 text-center text-brown-500">
        Loading categories…
      </Card>
    );
  }

  const isPending = addCategory.isPending || updateCategory.isPending;

  return (
    <>
      <Card className="p-4">
        <h2 className="text-xl font-bold text-brown-900 px-2 pt-2">
          Categories
          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 font-semibold px-1.5 py-0.5 rounded-full align-middle">
            {categories.length}
          </span>
        </h2>

        {/* Add / Edit Form */}
        <div className="p-4 border border-brown-200 rounded-lg bg-brown-50">
          {editingItem && (
            <p className="text-xs font-semibold text-yellow-700 mb-2">
              Editing:{" "}
              <span className="text-brown-800">{editingItem.name}</span>
            </p>
          )}
          <div className="flex flex-col md:flex-row gap-3 items-end">
            <Field>
              <FieldLabel htmlFor="categoryName">Category Name</FieldLabel>
              <Input
                id="categoryName"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter category name"
                className="p-6"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </Field>
            <Field>
              <FieldLabel>Icon</FieldLabel>
              <IconPicker value={formIcon} onChange={setFormIcon} />
            </Field>
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
                className="bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
              >
                {editingItem ? (
                  isPending ? (
                    "Saving…"
                  ) : (
                    "Save Changes"
                  )
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search categories..."
        />

        {/* Categories Table */}
        <div className="w-full lg:w-2/3 xl:w-1/2">
          <div className="border border-brown-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-brown-100">
                <tr>
                  <th className="text-left p-4 text-brown-900 font-semibold">
                    Icon
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
                    >
                      {searchQuery.trim()
                        ? "No categories match your search."
                        : "No categories yet"}
                    </td>
                  </tr>
                )}
                {paginated.map((category) => {
                  const Icon = getCategoryIcon(category.icon);
                  return (
                    <tr
                      key={category.id}
                      className={`border-t border-brown-200 hover:bg-brown-50 ${
                        editingItem?.id === category.id ? "bg-yellow-50" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-yellow-700" />
                        </div>
                      </td>
                      <td className="p-4 text-brown-900">{category.name}</td>
                      <td className="p-4">
                        <Badge
                          className={
                            isActive(category)
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }
                        >
                          {category.status}
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
                                  onClick={() => startEdit(category)}
                                  className="justify-start gap-2 font-normal text-brown-700 hover:bg-yellow-50"
                                >
                                  <Edit className="h-4 w-4" /> Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setStatusTarget(category)}
                                  className="justify-start gap-2 font-normal text-brown-700 hover:bg-yellow-50"
                                >
                                  <Power className="h-4 w-4" />
                                  {isActive(category)
                                    ? "Deactivate"
                                    : "Activate"}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteTarget(category)}
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
                  );
                })}
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
        </div>
      </Card>

      <DeleteConfirmationModal
        open={!!statusTarget}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
        title="Change Category Status"
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
        title="Delete Category"
        description={`Delete "${deleteTarget?.name}"? Products in this category will be affected. This cannot be undone.`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            const message = await deleteCategory.mutateAsync(deleteTarget.id);
            toast.success(message ?? "Category deleted successfully!");
            setDeleteTarget(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete category");
          }
        }}
      />
    </>
  );
}
