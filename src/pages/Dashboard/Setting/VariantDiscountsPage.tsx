import { useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import { Button } from "@/components/shared/ui/button";
import { ArrowLeft, Plus, Tag } from "lucide-react";
import { useVariantDiscounts } from "@/service/proDiscnt/proDiscnt.queries";
import { AddDiscountModal } from "@/components/Dashboard/discounts/AddDiscountModal";
import { VariantDiscountTable } from "@/components/Dashboard/discounts/VariantDiscountTable";

export default function VariantDiscountsPage() {
  const navigate = useNavigate();
  const { variantId } = useParams<{ productId: string; variantId: string }>();
  const location = useLocation();
  const state = (location.state ?? {}) as {
    variantName?: string;
    productName?: string;
  };
  const variantName = state.variantName || `Variant #${variantId}`;

  const { data: discounts = [], isLoading } = useVariantDiscounts(variantId);
  const [addOpen, setAddOpen] = useState(false);

  const activeCount = useMemo(
    () => discounts.filter((d) => d.status === "Active").length,
    [discounts],
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-brown-700 hover:text-brown-900 hover:bg-brown-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-brown-900 flex items-center gap-2">
                <Tag className="h-6 w-6 text-yellow-600" /> {variantName}{" "}
                Discounts
              </h1>
              <p className="text-slate-500 text-sm">
                {activeCount} active · {discounts.length} total
              </p>
            </div>
          </div>
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Discount
          </Button>
        </div>

        <VariantDiscountTable discounts={discounts} isLoading={isLoading} />
      </div>

      <AddDiscountModal
        open={addOpen}
        onOpenChange={setAddOpen}
        variantId={variantId ?? ""}
      />
    </DashboardLayout>
  );
}
