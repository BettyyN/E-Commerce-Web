import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  useProductDashboard,
  useChangeProductStat,
} from "@/service/product/product.queries";
import { useProVariants } from "@/service/proVar/proVar.queries";
import {
  useProImages,
  useAddProImage,
  useChangeMainProImage,
  useDeleteProImage,
} from "@/service/proImage/proImage.queries";
import { useMeasTypes } from "@/service/measType/measType.queries";
import { usePackTypes } from "@/service/packType/packType.queries";
import { ProductImageManager } from "@/components/Dashboard/product-detail/ProductImageManager";
import { VariantTable } from "@/components/Dashboard/product-detail/VariantTable";
import { ProductInfoCard } from "@/components/Dashboard/product-detail/ProductInfoCard";
import { DetailPageSkeleton } from "@/components/shared/PageSkeleton";
import { PageError } from "@/components/shared/PageError";

export default function AdminProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useProductDashboard(productId);
  const { data: variants = [] } = useProVariants(productId);
  const { data: images = [] } = useProImages(productId);
  const { data: measTypes = [] } = useMeasTypes();
  const { data: packTypes = [] } = usePackTypes();

  const addImage = useAddProImage();
  const changeMainImage = useChangeMainProImage();
  const deleteImage = useDeleteProImage();
  const changeProductStat = useChangeProductStat();

  const [imageDeleteId, setImageDeleteId] = useState<string | null>(null);
  const [imageSetMainId, setImageSetMainId] = useState<string | null>(null);
  const [statusProductOpen, setStatusProductOpen] = useState(false);

  const handleAddImages = async (file: File, isMain: boolean) => {
    if (!productId) return;
    try {
      const message = await addImage.mutateAsync({
        productId,
        isMain,
        image: file,
      });
      toast.success(message ?? `Image "${file.name}" uploaded`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload image");
    }
  };

  if (productError) {
    return (
      <DashboardLayout>
        <PageError
          message={productError.message}
          onBack={() => navigate("/dashboard/products")}
          backLabel="Back to Products"
        />
      </DashboardLayout>
    );
  }

  if (productLoading || !product) {
    return (
      <DashboardLayout>
        <DetailPageSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/products")}
            className="text-brown-700 hover:text-brown-900 hover:bg-brown-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-brown-900">
              {product.name}
            </h1>
            <p className="text-slate-500 text-sm">Product detail</p>
          </div>
        </div>

        {/* Variants */}
        <VariantTable
          productId={productId ?? ""}
          productName={product.name}
          variants={variants}
          measTypes={measTypes}
          packTypes={packTypes}
        />

        {/* Product info */}
        <ProductInfoCard
          product={product}
          variants={variants}
          onToggleStatus={() => setStatusProductOpen(true)}
        />

        {/* Images */}
        <Card className="p-5">
          <h3 className="text-base font-bold text-brown-900 mb-4">
            Images
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 font-semibold px-1.5 py-0.5 rounded-full">
              {images.length}
            </span>
          </h3>
          <ProductImageManager
            productId={productId ?? ""}
            images={images}
            onAdd={handleAddImages}
            onDelete={(id) => setImageDeleteId(id)}
            onSetMain={(id) => setImageSetMainId(id)}
            uploading={addImage.isPending}
          />
        </Card>
      </div>

      <DeleteConfirmationModal
        open={imageDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) setImageDeleteId(null);
        }}
        title="Delete Image"
        description="Are you sure you want to delete this product image? This cannot be undone."
        onConfirm={async () => {
          if (!imageDeleteId) return;
          try {
            const message = await deleteImage.mutateAsync(imageDeleteId);
            toast.success(message ?? "Image deleted");
            setImageDeleteId(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete image");
          }
        }}
      />

      <DeleteConfirmationModal
        open={imageSetMainId !== null}
        onOpenChange={(open) => {
          if (!open) setImageSetMainId(null);
        }}
        title="Change Main Image"
        description="Are you sure you want to set this image as the main product image?"
        confirmLabel="Confirm"
        onConfirm={async () => {
          if (!imageSetMainId) return;
          try {
            const message = await changeMainImage.mutateAsync(imageSetMainId);
            toast.success(message ?? "Main image updated");
            setImageSetMainId(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to set main image");
          }
        }}
      />

      <DeleteConfirmationModal
        open={statusProductOpen}
        onOpenChange={(open) => {
          if (!open) setStatusProductOpen(false);
        }}
        title="Change Product Status"
        description={`Are you sure you want to ${product.status === "Active" ? "deactivate" : "activate"} "${product.name}"?`}
        confirmLabel="Confirm"
        onConfirm={async () => {
          try {
            const message = await changeProductStat.mutateAsync({
              id: product.id,
              stat: product.status !== "Active",
            });
            toast.success(message ?? "Product status updated");
            setStatusProductOpen(false);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update status");
          }
        }}
      />
    </DashboardLayout>
  );
}
