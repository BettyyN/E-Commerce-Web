import { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/shared/ui/modal";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/select";
import { toast } from "sonner";
import { useProductDashboard, useUpdateProduct } from "@/service/product/product.queries";
import { useCategories } from "@/service/cat/cat.queries";
import type { ProListDto } from "@/types/product";

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProListDto | null;
}

export function EditProductModal({
  open,
  onOpenChange,
  product,
}: EditProductModalProps) {
  const { data: categories = [] } = useCategories();
  const { data: detail } = useProductDashboard(open ? product?.id : undefined);
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    isPerishable: false,
    shortDesc: "",
    desc: "",
    brand: "",
    originCountry: "",
    ingredients: "",
    storageInst: "",
  });

  // Pre-fill from the dashboard detail once it arrives
  useEffect(() => {
    if (detail) {
      setFormData({
        name: detail.name,
        categoryId:
          categories.find((c) => c.name === detail.category)?.id ?? "",
        isPerishable: detail.isPerishableStr === "Yes",
        shortDesc: detail.shortDesc,
        desc: detail.desc,
        brand: detail.brand,
        originCountry: detail.originCountry,
        ingredients: detail.ingredients,
        storageInst: detail.storageInst,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!formData.categoryId) {
      toast.error("Select a category");
      return;
    }
    try {
      const message = await updateProduct.mutateAsync({
        id: product.id,
        ...formData,
      });
      toast.success(message ?? "Product updated successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-3xl"
    >
      <ModalHeader>
        <ModalTitle>Edit Product</ModalTitle>
      </ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          {!detail ? (
            <p className="text-sm text-slate-500 py-6 text-center">
              Loading product…
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-brown-800">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Premium Organic Product"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-brown-800">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, categoryId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-brown-800">Brand</Label>
                <Input
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-brown-800">Origin Country</Label>
                <Input
                  value={formData.originCountry}
                  onChange={(e) =>
                    setFormData({ ...formData, originCountry: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-brown-800">
                  Short Description
                </Label>
                <Input
                  value={formData.shortDesc}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDesc: e.target.value })
                  }
                />
              </div>

              <div className="flex items-end pb-2.5">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={formData.isPerishable}
                    onChange={(e) =>
                      setFormData({ ...formData, isPerishable: e.target.checked })
                    }
                    className="w-4 h-4 accent-yellow-500"
                  />
                  Perishable
                </label>
              </div>

              <div className="space-y-1.5">
                <Label className="text-brown-800">Full Description</Label>
                <textarea
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-brown-800">Ingredients</Label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) =>
                    setFormData({ ...formData, ingredients: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-brown-800">Storage Instructions</Label>
                <textarea
                  value={formData.storageInst}
                  onChange={(e) =>
                    setFormData({ ...formData, storageInst: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background resize-none"
                />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-brown-300 text-brown-700 hover:bg-yellow-50 px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateProduct.isPending || !detail}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 px-6"
          >
            {updateProduct.isPending ? "Updating..." : "Update Product"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
