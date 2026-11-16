import { useProductDashboard } from "@/service/product/product.queries";

export function ProductDetailTabs({ productId }: { productId: string }) {
  const { data: product } = useProductDashboard(productId);

  const details = [
    { label: "Brand", value: product?.brand ?? "" },
    { label: "Origin", value: product?.originCountry ?? "" },
    { label: "Storage", value: product?.storageInst ?? "" },
    { label: "Ingredients", value: product?.ingredients ?? "" },
  ];

  return (
    <div className="p-0">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        <button
          className="px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors text-yellow-700 border-b-2 border-yellow-500 bg-yellow-50/50"
        >
          Details
        </button>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <p className="text-sm text-slate-700 leading-relaxed">
          {product?.desc || product?.shortDesc || "No description available."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {details.map(({ label, value }) =>
            value ? (
              <div
                key={label}
                className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                <span className="text-slate-400 text-sm w-20 shrink-0">
                  {label}
                </span>
                <span className="text-slate-800 font-medium text-sm">
                  {value}
                </span>
              </div>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
