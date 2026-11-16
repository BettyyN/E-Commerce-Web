import { Badge } from "@/components/shared/ui/badge";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import {  Power } from "lucide-react";
import type { ProDashBoard } from "@/types/product";
import type { ProVarListDto } from "@/types/productVariant";

interface ProductInfoCardProps {
  product: ProDashBoard;
  variants: ProVarListDto[];
  onToggleStatus: () => void;
}

export function ProductInfoCard({
  product,
  onToggleStatus,
}: ProductInfoCardProps) {

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-brown-900">{product.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={
              product.status === "Active"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-slate-100 text-slate-500 border-slate-200"
            }
          >
            {product.status}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={onToggleStatus}
            className="h-8 border-brown-300 text-brown-700 hover:bg-yellow-50"
          >
            <Power className="h-4 w-4 mr-1" />{" "}
            {product.status === "Active" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>

      <p className="text-sm text-brown-700 leading-relaxed">
        {product.desc || product.shortDesc}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl bg-yellow-50 border border-yellow-100 p-3">
          <div className="text-xs text-yellow-700 font-medium">Perishable</div>
          <p className="text-lg font-bold text-brown-900 mt-1">
            {product.isPerishableStr}
          </p>
        </div>
        <div className="rounded-xl bg-yellow-50 border border-yellow-100 p-3">
          <div className="text-xs text-yellow-700 font-medium">Brand</div>
          <p className="text-lg font-bold text-brown-900 mt-1">
            {product.brand || "—"}
          </p>
        </div>
        <div className="rounded-xl bg-yellow-50 border border-yellow-100 p-3">
          <div className="text-xs text-yellow-700 font-medium">Origin</div>
          <p className="text-lg font-bold text-brown-900 mt-1">
            {product.originCountry || "—"}
          </p>
        </div>
        <div className="rounded-xl bg-yellow-50 border border-yellow-100 p-3">
          <div className="text-xs text-yellow-700 font-medium">Category</div>
          <p className="text-lg font-bold text-brown-900 mt-1">
            {product.category || "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
            Short Description
          </p>
          <p className="text-brown-700">{product.shortDesc || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
            Ingredients
          </p>
          <p className="text-brown-700">{product.ingredients || "—"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
            Storage
          </p>
          <p className="text-brown-700">{product.storageInst || "—"}</p>
        </div>
      </div>
    </Card>
  );
}
