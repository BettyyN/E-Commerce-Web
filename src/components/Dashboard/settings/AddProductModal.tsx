import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  productStep1Schema,
  type ProductStep1Values,
} from "@/schemas/productSchema";
import { useAddProduct } from "@/service/product/product.queries";
import { useCategories } from "@/service/cat/cat.queries";
import type { ProAddDto } from "@/types/product";

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY: ProductStep1Values = {
  name: "",
  categoryId: "",
  isPerishable: false,
  isActive: true,
  shortDesc: "",
  desc: "",
  brand: "",
  originCountry: "",
  ingredients: "",
  storageInst: "",
};

export function AddProductModal({ open, onOpenChange }: AddProductModalProps) {
  const addProduct = useAddProduct();
  const { data: categories = [] } = useCategories();

  const form = useForm<ProductStep1Values>({
    resolver: zodResolver(productStep1Schema),
    defaultValues: EMPTY,
  });

  // Reset the form each time the modal opens
  useEffect(() => {
    if (open) form.reset(EMPTY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSubmit = form.handleSubmit(async (data) => {
    const payload: ProAddDto = {
      name: data.name,
      isPerishable: data.isPerishable,
      categoryId: data.categoryId,
      desc: data.desc ?? "",
      shortDesc: data.shortDesc,
      brand: data.brand,
      originCountry: data.originCountry,
      ingredients: data.ingredients ?? "",
      storageInst: data.storageInst ?? "",
    };

    try {
      const message = await addProduct.mutateAsync(payload);
      toast.success(
        message ??
          "Product created! Manage images and variants from the detail page.",
      );
      form.reset(EMPTY);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add product");
    }
  });

  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-3xl">
      <ModalHeader>
        <ModalTitle>Add New Product</ModalTitle>
      </ModalHeader>
      <form onSubmit={onSubmit}>
        <ModalBody>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...form.register("name")}
                placeholder="e.g. Organic Honey"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.watch("categoryId")}
                onValueChange={(v) => form.setValue("categoryId", v)}
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
              {form.formState.errors.categoryId && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>
                Brand <span className="text-red-500">*</span>
              </Label>
              <Input
                {...form.register("brand")}
                placeholder="e.g. NatureCo"
              />
              {form.formState.errors.brand && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.brand.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>
                Origin Country <span className="text-red-500">*</span>
              </Label>
              <Input
                {...form.register("originCountry")}
                placeholder="e.g. Ethiopia"
              />
              {form.formState.errors.originCountry && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.originCountry.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>
                Short Description <span className="text-red-500">*</span>
              </Label>
              <Input
                {...form.register("shortDesc")}
                placeholder="One-line summary"
              />
              {form.formState.errors.shortDesc && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.shortDesc.message}
                </p>
              )}
            </div>

            <div className="flex items-end pb-2.5">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  {...form.register("isPerishable")}
                  className="w-4 h-4 accent-yellow-500"
                />
                Perishable
              </label>
            </div>

            <div className="space-y-1.5">
              <Label>Full Description</Label>
              <textarea
                {...form.register("desc")}
                rows={3}
                placeholder="Detailed description..."
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Ingredients</Label>
              <textarea
                {...form.register("ingredients")}
                rows={3}
                placeholder="e.g. Honey, Water"
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Storage Instructions</Label>
              <textarea
                {...form.register("storageInst")}
                rows={3}
                placeholder="e.g. Keep cool & dry"
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background resize-none"
              />
            </div>
          </div>
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
            disabled={addProduct.isPending}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 px-6"
          >
            {addProduct.isPending ? "Adding..." : "Add Product"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
