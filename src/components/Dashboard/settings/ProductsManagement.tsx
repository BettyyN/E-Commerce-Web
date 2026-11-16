import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Pagination } from "@/components/shared/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/ui/popover";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { EditProductModal } from "./EditProductModal";
import { AddProductModal } from "./AddProductModal";
import {
  Plus,
  Trash2,
  MoreVertical,
  Edit,
  Eye,
  Power,
  Leaf,
  PackageOpen,
} from "lucide-react";
import { toast } from "sonner";
import {
  useProducts,
  useChangeProductStat,
  useDeleteProduct,
} from "@/service/product/product.queries";
import type { ProListDto } from "@/types/product";
import { TableToolbar } from "@/components/shared/TableToolbar";
import { useResettablePage } from "@/lib/tableFilters";

const ITEMS_PER_PAGE = 8;

export function ProductsManagement() {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts();
  const changeStat = useChangeProductStat();
  const deleteProduct = useDeleteProduct();

  const [deleteTarget, setDeleteTarget] = useState<ProListDto | null>(null);
  const [editTarget, setEditTarget] = useState<ProListDto | null>(null);
  const [statusTarget, setStatusTarget] = useState<ProListDto | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useResettablePage(
    searchQuery.trim().toLowerCase(),
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.category, p.status, p.isPerishableStr].some((v) =>
        (v ?? "").toLowerCase().includes(q),
      ),
    );
  }, [products, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [filtered, currentPage],
  );

  const isActive = (p: ProListDto) => p.status === "Active";

  const handleStatusConfirm = async () => {
    if (!statusTarget) return;
    try {
      const message = await changeStat.mutateAsync({
        id: statusTarget.id,
        stat: !isActive(statusTarget),
      });
      toast.success(
        message ??
          `"${statusTarget.name}" marked as ${
            isActive(statusTarget) ? "Inactive" : "Active"
          }`,
      );
      setStatusTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <Card className="p-10 text-center text-brown-500">
        Loading products…
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-brown-900">
            Products
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 font-semibold px-1.5 py-0.5 rounded-full align-middle">
              {products.length}
            </span>
          </h2>
          <div className="flex items-center gap-2">
            <TableToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search products..."
              className="mb-2"
            />
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <PackageOpen className="h-10 w-10 mx-auto mb-3" />
            <p className="font-medium">No products yet</p>
            <p className="text-sm">Create your first product to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brown-200">
                  <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                    Perishable
                  </th>
                  <th className="text-center py-3 px-4 text-brown-700 font-semibold">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-brown-700 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-sm text-slate-400"
                    >
                      {searchQuery.trim()
                        ? "No products match your search."
                        : "No products yet"}
                    </td>
                  </tr>
                )}
                {paginated.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-brown-100 hover:bg-brown-50"
                  >
                    <td className="py-3 px-4">
                      <span className="text-brown-900 font-medium">
                        {p.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-brown-700">{p.category}</td>
                    <td className="py-3 px-4">
                      {p.isPerishableStr === "Yes" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <Leaf className="h-3 w-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        className={
                          isActive(p)
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/dashboard/products/${p.id}/detail`, {
                              state: { productName: p.name },
                            })
                          }
                          className="h-8 px-3 text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-50 gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" /> Detail
                        </Button>
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
                          <PopoverContent className="w-44 p-1" align="end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditTarget(p)}
                              className="w-full justify-start gap-2 font-normal text-brown-700 hover:bg-yellow-50"
                            >
                              <Edit className="h-4 w-4" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setStatusTarget(p)}
                              className="w-full justify-start gap-2 font-normal text-brown-700 hover:bg-yellow-50"
                            >
                              <Power className="h-4 w-4" />
                              {isActive(p) ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(p)}
                              className="w-full justify-start gap-2 font-normal text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </Button>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filtered.length}
        />
      </Card>

      <AddProductModal open={showAddModal} onOpenChange={setShowAddModal} />

      <EditProductModal
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        product={editTarget}
      />

      {/* Change status confirmation */}
      <DeleteConfirmationModal
        open={!!statusTarget}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
        title="Change Product Status"
        description={`Are you sure you want to mark "${statusTarget?.name}" as ${
          statusTarget && isActive(statusTarget) ? "Inactive" : "Active"
        }?`}
        confirmLabel="Confirm"
        onConfirm={handleStatusConfirm}
      />

      <DeleteConfirmationModal
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Product"
        description={`Delete "${deleteTarget?.name}"? Its variants, discounts and images will be removed too. This cannot be undone.`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            const message = await deleteProduct.mutateAsync(deleteTarget.id);
            toast.success(message ?? "Product deleted");
            setDeleteTarget(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete product");
          }
        }}
      />
    </>
  );
}
