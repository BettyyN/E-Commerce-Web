import { Button } from "../shared/ui/button";
import { Card, CardContent, CardFooter } from "../shared/ui/card";
import { ShoppingBag, Filter, ShoppingCart, Tag, Sparkles } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { SkeletonCard } from "@/components/shared/ui/skeletoncard";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { LoginModal, SignupModal } from "@/components/shared/AuthModal";
import { useAuthStore } from "@/store/auth.store";
import { useProViews } from "@/service/proView/proView.queries";
import { toast } from "sonner";
import { parseMoney } from "@/lib/format";
import type { ProViewListDto } from "@/types/proView";
import { ProViewImage } from "@/components/shared/ProViewImage";

interface RecentItemsProps {
  selectedCategories?: string[];
  searchQuery?: string;
  overHero?: boolean;
}

function ProductCard({ row }: { row: ProViewListDto }) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useAuthStore();
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const price = parseMoney(row.price);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    const result = addItem({
      variantId: row.variantId,
      name: `${row.product} — ${row.variant}`,
      price,
      image: row.url ?? undefined,
      // ProView list has no quantity field; -1 = unknown stock, don't clamp
      stock: -1,
      packagingType: row.pack || undefined,
    });
    if (result === "max") {
      toast.info("All available stock is already in your cart");
    } else {
      toast.success(`${row.product} (${row.variant}) added to cart`);
    }
  };

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer py-3 sm:py-6 gap-2 sm:gap-6 bg-white border border-slate-200 shadow-sm animate-fade-in-up transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-900/10 hover:border-yellow-400"
      onClick={() => navigate(`/product/${row.id}`)}
    >
      {/* Image area: soft neutral panel, white image backgrounds blend into it */}
      <div className="relative mx-3 sm:mx-4 h-36 sm:h-48 md:h-60 overflow-hidden rounded-xl bg-stone-50">
        {row.url ? (
          <ProViewImage
            url={row.url}
            alt={row.product ?? ""}
            className="h-full w-full object-contain p-4 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-stone-50 to-yellow-50">
            <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <ShoppingBag className="h-9 w-9 text-brown-700/70" />
            </div>
          </div>
        )}

        {/* Discount badge: always visible, no hover-only animation */}
        {row.hasDiscount && row.discDis && (
          <div className="absolute top-2 right-2 z-20 flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-white shadow-md">
            <Tag className="h-3 w-3" />
            <span className="text-xs font-bold">{row.discDis}</span>
          </div>
        )}

        {/* Category badge */}
        <span className="absolute top-2 left-2 z-10 rounded-full border border-slate-200 bg-white px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-brown-800 shadow-sm">
          {row.category}
        </span>
      </div>

      {/* Card Content */}
      <CardContent className="relative z-10 px-3 sm:px-6 pb-1">
        <h3 className="font-bold text-brown-900 text-sm sm:text-base line-clamp-2 transition-all duration-300 group-hover:text-yellow-700">
          {row.product}
        </h3>
        <p className="text-xs text-slate-500 leading-tight group-hover:text-yellow-700">
          {row.variant}
        </p>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="px-3 sm:px-5 pt-0 relative z-10">
        <div className="w-full">
          <div className="flex items-center justify-between gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="shrink-0 min-w-0 bg-yellow-500 hover:bg-yellow-600 text-brown-900 rounded-lg text-xs sm:text-sm font-semibold py-2 sm:py-2.5 px-2 sm:px-4 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
            >
              <span className="truncate hidden sm:block">Add to cart</span>
              <ShoppingCart className="h-4 w-4 shrink-0" />
            </Button>
            <div className="text-right min-w-0">
              <div className="text-sm sm:text-lg font-bold text-brown-900 leading-tight whitespace-nowrap">
                {row.price}
              </div>
              {row.pack && (
                <div className="text-[10px] sm:text-xs text-slate-400 leading-tight">
                  / {row.pack}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardFooter>

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
    </Card>
  );
}

const RecentItems = ({
  selectedCategories = [],
  searchQuery = "",
  overHero = false,
}: RecentItemsProps) => {
  
  const { data: rows = [], isLoading: productsLoading } = useProViews();

  // Filter by category and search query
  const filteredRows = useMemo(() => {
    let filtered = rows;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((r) =>
        selectedCategories.includes(r.category ?? ""),
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.product?.toLowerCase().includes(query) ||
          r.variant?.toLowerCase().includes(query) ||
          r.category?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [rows, selectedCategories, searchQuery]);

  const [visibleCount, setVisibleCount] = useState(4);
  const [filterSig, setFilterSig] = useState(
    () => `${selectedCategories.join("|")}|${searchQuery}`,
  );
  const nextFilterSig = `${selectedCategories.join("|")}|${searchQuery}`;
  if (nextFilterSig !== filterSig) {
    setFilterSig(nextFilterSig);
    setVisibleCount(4);
  }

  const isLoadingMore = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const first = entries[0];
      if (
        first.isIntersecting &&
        visibleCount < filteredRows.length &&
        !isLoadingMore.current
      ) {
        isLoadingMore.current = true;
        // Small delay keeps the skeleton visible and the scroll smooth
        setTimeout(() => {
          setVisibleCount((prev) => prev + 4);
          isLoadingMore.current = false;
        }, 400);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredRows.length]);

  const visibleRows = filteredRows.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRows.length;
  const showEmptyState =
    !productsLoading &&
    filteredRows.length === 0 &&
    (selectedCategories.length > 0 || searchQuery.trim() !== "");

  if (showEmptyState) {
    return (
      <div className="py-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-brown-900 mb-3">
            Featured Products
          </h2>
          <p className="text-brown-600">Discover our latest shopping Items</p>
        </div>

        <div className="text-center py-12 bg-brown-50 rounded-xl">
          <Filter className="h-12 w-12 text-brown-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-brown-800 mb-2">
            No items found
          </h3>
          <p className="text-brown-600 mb-6">
            {searchQuery.trim() !== "" ? (
              <>
                No items match your search for{" "}
                <span className="font-semibold text-yellow-600">
                  "{searchQuery}"
                </span>
                {selectedCategories.length > 0 && (
                  <>
                    {" "}in {selectedCategories.join(", ")}
                  </>
                )}
              </>
            ) : (
              <>
                No items found in category
                {selectedCategories.length > 1 ? "s" : ""}:{" "}
                <span className="font-semibold text-yellow-600">
                  {selectedCategories.join(", ")}
                </span>
              </>
            )}
          </p>
          <Button
            variant="outline"
            className="border-brown-300 text-brown-700 hover:bg-brown-50 hover:text-brown-900 rounded-full px-6"
            onClick={() => window.location.reload()}
          >
            View All Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-6">
      {/* Section Header */}
      {overHero ? (
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-brown-900 md:backdrop-blur-md   md:drop-shadow-lg text-lg md:text-2xl font-bold px-5">
            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-yellow-600 md:text-yellow-300" />
            Featured Products
          </span>
        </div>
      ) : (
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-brown-900 mb-3">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : selectedCategories.length > 0
                ? selectedCategories.length === 1
                  ? `${selectedCategories[0]} Items`
                  : "Filtered Items"
                : "Featured Products"}
          </h2>

          {(selectedCategories.length > 0 || searchQuery) && (
            <div
              className={`mt-4 inline-flex items-center px-4 py-2 rounded-full ${
                overHero ? "bg-black/40 backdrop-blur-sm" : "bg-yellow-50"
              }`}
            >
              <span className="text-sm text-brown-700">
                {searchQuery ? "Searching for:" : "Filtered by:"}{" "}
                <span className="font-semibold text-yellow-600">
                  {searchQuery
                    ? searchQuery
                    : selectedCategories.length === 1
                      ? selectedCategories[0]
                      : `${selectedCategories.length} categories`}
                </span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Items Grid — 2 columns on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {productsLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={`initial-skeleton-${index}`} />
          ))
        ) : (
          <>
            {visibleRows.map((row) => (
              <ProductCard
                key={row.variantId}
                row={row}
              />
            ))}

            {hasMore &&
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={`load-more-skeleton-${index}`} />
              ))}
          </>
        )}
      </div>

      {/* Scroll Sentinel for infinite scroll */}
      <div
        ref={sentinelRef}
        id="scroll-sentinel"
        className="h-10 flex items-center justify-center mt-8"
      >
        {!productsLoading && hasMore && (
          <div className="flex items-center justify-center space-x-2">
            <div
              className="h-2 w-2 bg-yellow-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="h-2 w-2 bg-yellow-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="h-2 w-2 bg-yellow-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        )}

        {!hasMore && visibleRows.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-brown-50">
              <span className="text-brown-600 text-sm font-medium">
                🎉 You've reached the end!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentItems;
