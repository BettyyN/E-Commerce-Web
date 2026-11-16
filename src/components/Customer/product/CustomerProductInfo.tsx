import { useState } from "react";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/auth.store";
import { Minus, Plus, ShoppingCart, PackageX } from "lucide-react";
import { parseMoney } from "@/lib/format";
import { formatETB } from "@/lib/utils";
import { LoginModal, SignupModal } from "@/components/shared/AuthModal";
import { toast } from "sonner";
import type { ProVariantList } from "@/types/proView";

interface CustomerProductInfoProps {
  productName: string;
  shortDesc: string | null;
  variants: ProVariantList[];
}

const VAT_RATE = 0.15;

export function CustomerProductInfo({
  productName,
  shortDesc,
  variants,
}: CustomerProductInfoProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { isAuthenticated } = useAuthStore();

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const allVariants = variants ?? [];

  const selected =
    allVariants.find((v) => v.id === selectedId) ?? allVariants[0] ?? null;
  const quantity = selected ? (quantities[selected.id] ?? 0) : 0;

  const setQuantity = (val: number) => {
    if (!selected) return;
    setQuantities((prev) => ({ ...prev, [selected.id]: val }));
  };

  const listPrice = selected ? parseMoney(selected.oldPrice ?? "0") : 0;
  const hasDiscount = selected?.hasDiscount ?? false;

  const stagedVariants = allVariants
    .map((v) => ({ variant: v, qty: quantities[v.id] ?? 0 }))
    .filter((r) => r.qty > 0);

  const stagedTotal = stagedVariants.reduce(
    (sum, { variant, qty }) => sum + parseMoney(variant.newPrice ?? "0") * qty,
    0,
  );

  const handleAddToCart = () => {
    if (!selected) return;
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }

    if (stagedVariants.length === 0) {
      toast.error("Set a quantity first");
      return;
    }

    stagedVariants.forEach(({ variant, qty }) => {
      addItem(
        {
          variantId: variant.id,
          name: `${productName} — ${variant.name}`,
          price: parseMoney(variant.newPrice ?? "0"),
          packagingType: variant.pack ?? undefined,
        } as Parameters<typeof addItem>[0],
        qty,
      );
    });

    if (stagedVariants.length === 1) {
      toast.success(
        `${productName} (${stagedVariants[0].variant.name ?? ""}) added to cart`,
      );
    } else {
      toast.success(`${stagedVariants.length} items added to cart`);
    }

    setQuantities((prev) => {
      const next = { ...prev };
      stagedVariants.forEach(({ variant }) => {
        next[variant.id] = 0;
      });
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">
          {productName}
        </h1>
      </div>

      {shortDesc && (
        <p className="text-sm text-slate-600 leading-relaxed">{shortDesc}</p>
      )}

      {/* Price */}
      <div className="py-2">
        {selected ? (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {selected.newPrice}
            </span>
            {hasDiscount && listPrice > 0 && (
              <>
                <span className="text-sm text-slate-400 line-through">
                  {selected.oldPrice}
                </span>
                <Badge className="bg-red-500 text-white hover:bg-red-500 text-[10px] px-2 py-0.5">
                  {selected.discDis}
                </Badge>
              </>
            )}
          </div>
        ) : (
          <span className="text-3xl font-bold text-slate-400">—</span>
        )}
        <p className="text-[11px] text-slate-400 mt-1">
          VAT included · {VAT_RATE * 100}% VAT
        </p>
      </div>

      {/* Variety selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-800">Variety</p>
          {selected && (
            <Badge variant="secondary" className="text-xs">
              {selected.name}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {allVariants.map((v) => {
            const savedQty = quantities[v.id] ?? 0;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedId(v.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all duration-200 ${
                  selected?.id === v.id
                    ? "bg-yellow-50 text-yellow-800 border-yellow-400 shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:border-yellow-300 hover:bg-yellow-50/50"
                }`}
              >
                {v.name}
                {v.hasDiscount && (
                  <span className="text-xs text-red-600 font-bold ml-1">
                    {v.discDis}
                  </span>
                )}
                {savedQty > 0 && selected?.id !== v.id && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-yellow-500 text-brown-900 text-[10px] font-bold flex items-center justify-center">
                    {savedQty}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity */}
      {selected && (
        <div>
          <p className="text-sm font-semibold text-slate-800 mb-2">Quantity</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0 border-2 border-slate-200 rounded-lg w-fit overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(0, quantity - 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-5 py-2 text-slate-900 font-semibold text-base border-x-2 border-slate-200 min-w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {selected.pack && (
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
                {selected.pack}
              </span>
            )}
            
          </div>

          {stagedVariants.length > 0 && (
            <div className="mt-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              {stagedVariants.map(({ variant, qty }) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between text-xs text-slate-500"
                >
                  <span>
                    {variant.name}{" "}
                    <span className="text-slate-400">×{qty}</span>
                  </span>
                  <span className="font-medium text-slate-700">
                    {formatETB(parseMoney(variant.newPrice ?? "0") * qty)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-xs text-slate-500">Total</span>
                <span className="text-sm font-bold text-slate-900">
                  {formatETB(stagedTotal)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <Button
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-bold h-11 text-base shadow-lg hover:shadow-xl transition-all"
        onClick={handleAddToCart}
        disabled={!selected}
      >
        {selected ? (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
          </>
        ) : (
          <>
            <PackageX className="h-5 w-5 mr-2" /> Unavailable
          </>
        )}
      </Button>

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />
      <SignupModal
        open={signupOpen}
        onOpenChange={setSignupOpen}
        onSwitchToLogin={() => setLoginOpen(true)}
      />
    </div>
  );
}
